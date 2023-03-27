import React from 'react';
import Chatbot from 'react-chatbot-kit'
import './App.css';
import ActionProvider from './chatbot/ActionProvider.jsx';
import Config from './chatbot/Config';
import MessageParser from './chatbot/MessageParser.jsx';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000');

function App() {
  return (
    <div className="App">
        <Chatbot 
          config={Config}
          actionProvider={ActionProvider}
          messageParser={MessageParser}
        />
    </div>
  );
};

export default App;
