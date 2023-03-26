import React from 'react';
import Chatbot from 'react-chatbot-kit'
import './App.css';
import ActionProvider from './chatbot/ActionProvider.jsx';
import Config from './chatbot/Config';
import MessageParser from './chatbot/MessageParser.jsx';

function App() {
  return (
    <div className="App">
      <div style={{maxWidth: "600px"}}>
        <Chatbot 
          config={Config}
          actionProvider={ActionProvider}
          messageParser={MessageParser}
        />
      </div>
      <form action="../../post" method="post" 
              className="form">
          <button type="submit">Connected?</button>
      </form>
    </div>
  );
};

export default App;
