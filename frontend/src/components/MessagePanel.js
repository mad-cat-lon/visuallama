import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {MessageInput} from './MessageInput';
import {Message} from './Message';


export class MessagePanel extends React.Component {

    render() {
        let list = <div className="no-content-message">No messages yet</div>
        // TODO: make pretty later
        if (this.props.model && this.props.model.messages) {
            list = this.props.model.messages.map(m => <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text} question={m.question} waiting={m.waiting}></Message>)
        }
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 10px',
                height: '80vh',
                width: '100%',
                background: '#00000',
                border: 2,
                borderColor: '#f50057'
                }}>
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        padding: '16px 16px',
                    }}
                >
                    {list}
                </Stack>
                {this.props.model &&
                    <MessageInput
                    onSendMessage={this.props.onSendMessage}
                    model={this.props.model}
                    />
                }
            </Box>
        );
    }
}