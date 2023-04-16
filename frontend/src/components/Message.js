import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Grow from '@mui/material/Grow';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: 'left',
    width: '99%',
    color: theme.palette.text.secondary,
  }));

export class Message extends React.Component {

    handleIncomingToken = (token) => {
        this.props.text = this.props.text.concat(token);
    }

    render() {
        return (
            <Box sx={{
                padding: '5px 5px'
            }}>
            <Item>{this.props.text}</Item>
            {this.props.waiting && <LinearProgress/>}
            </Box>
        );
    }
}   