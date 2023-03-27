import React from 'react';
import { Message } from './Message';
import { MessageHeader } from './MessageHeader';

export class MessagePanel extends React.Component {
    state = {input_val: ''}
    send = () => {
        if (this.state.input_val && this.state.input_val != '') {
            this.props.onSendMessage(this.props.model.id, this.state.input_val);
            this.setState({input_val: ''});
        }
    }

    handleInput = e => {
        this.setState({input_val: e.target.value});
    }

    handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.send()
        }
    }

    render() {
        let list = <div className="no-content-message">Nothing to show</div>
        if (this.props.model && this.props.model.messages) {
            //list = this.props.model.messages.map(m => <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text}></Message>);
            list = [];
            let m = this.props.model.messages[0];
            list.push(<MessageHeader key={m.id} id={m.id} senderName={m.senderName} text={m.text}></MessageHeader>)
            for (let i=1; i < this.props.model.messages.length; i++) {
                let n = this.props.model.messages[0];
                console.log(this.props.model.messages[i])
                if (this.props.model.messages[i-1].senderName === n.senderName) {
                    list.push(<Message key={m.id} id={m.id} senderName={m.senderName} text={m.text}></Message>)
                }
                else {
                    list.push(<MessageHeader key={m.id} id={m.id} senderName={m.senderName} text={m.text}></MessageHeader>)
                }
            }
        }
        return (
            <div className="messages-panel">
                <div className="messages-list">{list}</div>
                {this.props.model &&
                    <div className="messages-input">
                        <input type="text" onChange={this.handleInput} value={this.state.input_val} onKeyDown={this.handleKeyPress}/>
                        <button onClick={this.send}>Send</button>
                    </div>
                }
            </div>
        )
    }
}