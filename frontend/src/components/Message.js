import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

/*
export class Message extends React.Component {
    render() {
        return (
            <div className='message-item'>
                <span>{this.props.text}</span>
            </div>
        )
    }
}
*/ 

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: 'left',
    width: '100%',
    color: theme.palette.text.secondary,
  }));

export class Message extends React.Component {

    handleIncomingToken = (token) => {
        this.props.text = this.props.text.concat(token);
    }

    render() {
        return (
            <Box>
            <Item>{this.props.text}</Item>
            {this.props.waiting && <LinearProgress/>}
            </Box>
        );
    }
}   