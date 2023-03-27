import React from 'react';
import '../chat.scss';
import {MessagePanel} from './MessagePanel'
import {ModelList} from './ModelList'
import socketClient from 'socket.io-client';
const server = "http://localhost:4000";

export class Chat extends React.Component {

    state = {
        model: null,
        history: null,
        socket: null,
    }
    socket; 

    componentDidMount(){
        this.loadModels();
        this.configureSocket();
    }

    configureSocket = () => {

        var socket = socketClient(server);
        socket.on('connection', () => {
            if (this.state.model) {
                this.handleModelSelect(this.state.model.id);
            }
        });

        socket.on('model', model => {
            let models = this.state.models;
            models.forEach(c => {
                if (c.id === model.id) {
                    c.participants = model.participants;
                }
            });
            this.setState({ models });
        });

        socket.on('message', message => {
            console.log(`Received message: ${message}`)
            let models = this.state.models
            models.forEach(m => {
                if (m.id === message.model_id) {
                    if (!m.messages) {
                        m.messages = [message];
                    } else {
                        m.messages.push(message);
                    }
                }
            });
            this.setState({ models });
        });
        this.socket = socket;
    }

    loadModels = async () => {
        fetch("http://localhost:4000/getModels").then(async response => {
            let data = await response.json();
            console.log("Got models");
            console.log(data.models)
            this.setState({ models: data.models });
        })
    }

    handleSendMessage = (model_id, text) => {
        console.log("Sending message")
        this.socket.emit('send-message', {model_id, text, senderName: this.socket.id, id: Date.now() });
    }

    handleModelSelect = id => {
        let model = this.state.models.find(m => {return m.id === id;});
        this.setState({ model })
        console.log("Loading model")
        this.socket.emit('load-model', id, ack => {
        });
    }

    render() {
        return (
            <div className='chat-app'>
                <ModelList models={this.state.models} onSelectModel={this.handleModelSelect}/>
                <MessagePanel onSendMessage={this.handleSendMessage} model={this.state.model}/>
            </div>
        );
    }
}