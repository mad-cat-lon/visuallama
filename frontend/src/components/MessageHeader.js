import React from 'react';

export class MessageHeader extends React.Component {
    render() {
        return (
            <div className='message-item'>
                <div><b>{this.props.senderName}</b></div>
                <span>{this.props.text}</span>
            </div>
        )
    }
}