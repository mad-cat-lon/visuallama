import React from 'react';

class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
    console.log('fjfjf')
  }

  parse(message) {
    if (message.includes('hello')) {
      console.log('hi');   
    };
  }
}

export default MessageParser;
  