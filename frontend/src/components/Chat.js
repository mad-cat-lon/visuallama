import React from 'react';
import {ModelList} from './ModelList'
import socketClient from 'socket.io-client';
import {MessageStack} from './MessageStack';
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

        socket.on('output', message => {
            console.log(`Received output: ${message}`)
            let models = this.state.models
            models.forEach(m => {
                if (m.id === message.model_id) {
                    if (!m.messages) {
                        m.messages = [message];
                    } else {
                        let lastOutputIndex = m.messages.findLastIndex((output) => output.senderName == m.name);
                        console.log(`lastOutputIndex: ${lastOutputIndex}`);
                        if (lastOutputIndex == -1) {
                            m.messages.push(message);
                        }
                        else {
                            m.messages[lastOutputIndex].text = m.messages[lastOutputIndex].text.concat(message.text);
                            m.messages[lastOutputIndex].waiting = true;
                        }
                    }
                }
            });
            this.setState({ models });
        });
        
        socket.on('input', message => {
            console.log(`Received input: ${message}`)
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
        })

        socket.on('finished', message => {
            console.log("Finished output");
            let models = this.state.models
            models.forEach(m => {
                if (m.id == message.model_id) {
                    let lastOutputIndex = m.messages.findLastIndex((output) => output.senderName == m.name);
                    m.messages[lastOutputIndex].waiting = false;
                    m.messages.push(message);
                }
            });
            this.setState({ models });
        })
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
        console.log("Sending input")
        this.socket.emit('send-input', {model_id, text, senderName: this.socket.id, id: Date.now() });
    }

    handleLoadModel = id => {
        let model = this.state.models.find(m => {return m.id === id;});
        this.setState({ model })
        console.log("Loading model")
        this.socket.emit('load-model', id, ack => {
        });
    }

    handleUnloadModel = id => {
        let model = this.state.models.find(m => {return m.id === id;});
        this.setState({ model })
        console.log("Unloading model")
        this.socket.emit('unload-model', id, ack => {
        });
    }

    render() {
        return (
            <div className='chat-app'>
                <ModelList models={this.state.models} onLoadModel={this.handleLoadModel} onUnloadModel={this.handleUnloadModel}/>
                <MessageStack onSendMessage={this.handleSendMessage} model={this.state.model}/>
            </div>
        );
    }
}