import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export class MessageInput extends React.Component {

    state = {input_val: ''}
    send = () => {
        if (this.state.input_val && this.state.input_val != '') {
            // Fix how this is implemented later
            this.props.onSendMessage(this.props.model.id, this.state.input_val);
            this.setState({input_val: ''});
            this.forceUpdate();
        }
    }

    handleInput = e => {
        this.setState({input_val: e.target.value});
    }

    handleKeyPress = e => {
        if (e.key === 'Enter') {
            this.send();
        }
    }
    render() {
        return (
                <TextField id="outlined-basic" label="Input" variant="outlined"
                value={this.state.input_val}
                onChange={this.handleInput} onKeyDown={this.handleKeyPress}
                sx={{
                    width: '100%',
                    margin: 'auto',
                    display: 'flex',
                    borderRadius: '16px',
                }}
                />
        );
    }

}