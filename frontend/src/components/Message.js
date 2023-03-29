import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

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
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

export class Message extends React.Component {

    handleIncomingToken = (token) => {
        this.props.text = this.props.text.concat(token);
    }

    render() {
        return (
            <Item>{this.props.text}</Item>
        );
    }
}