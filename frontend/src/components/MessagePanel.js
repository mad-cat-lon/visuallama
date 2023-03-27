import React from 'react';
import { Message } from './Message';

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

    render() {
        let list = <div className="no-content-message">Nothing to show</div>
        if (this.props.model && this.props.model.messages) {
            list = this.props.model.messages.map(m => <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text}></Message>);
        }
        return (
            <div className="messages-panel">
                <div className="messages-list">{list}</div>
                {this.props.model &&
                    <div className="messages-input">
                        <input type="text" onChange={this.handleInput} value={this.state.input_val} />
                        <button onClick={this.send}>Send</button>
                    </div>
                }
            </div>
        )
    }
}