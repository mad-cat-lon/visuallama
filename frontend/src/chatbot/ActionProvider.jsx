import React from 'react';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');

const ActionProvider = ({createChatBotMessage, setState, children}) => {

    const handleHello = () => {
        const botMessage = createChatBotMessage("Hi, nice to meet you");
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    const handleDog = () => {
        const botMessage = createChatBotMessage("Here's a nice dog picture for you!", {
            widget: 'dogPicture',
        });
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    const handleInitChat = async () => {
        socket.emit('message', {
            text: "init",
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
        });
        socket.on("reply", (reply) => {
            console.log(reply)
            const botMessage = createChatBotMessage(reply.text)
            setState((prev) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
            }));
        });
    };

    const handleSendMessage = (message) => {
        socket.emit('message', {
            text: message,
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
        })
    }

    return ( 
        <div> 
            {
                React.Children.map(children, (child) => {
                    return React.cloneElement(child, {
                        actions: {
                            handleHello,
                            handleDog,
                            handleInitChat,
                            handleSendMessage,
                        },
                    });
                })
            } 
        </div>
    );
};

export default ActionProvider;