import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import {MessageInput} from './MessageInput';
import {Message} from './Message';
import TextField from '@mui/material/TextField';


export class MessageStack extends React.Component {

    render() {
        let list = <div className="no-content-message">No messages yet</div>
        // TODO: make pretty later
        if (this.props.model && this.props.model.messages) {
            list = this.props.model.messages.map(m => <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text}></Message>)
        }
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 10px',
                height: '80vh',
                width: '100%'
                }}>
                <Stack
                    direction="column"
                    divider={<Divider orientation="horizontal" flexItem />}
                    spacing={2}
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        padding: '10px 16px',
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