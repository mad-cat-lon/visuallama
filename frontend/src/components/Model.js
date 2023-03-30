import React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Chip from '@mui/material/Chip';
import { Slider, Box, TextField } from '@mui/material';
import { Stack } from '@mui/system';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));
  
  
export class Model extends React.Component {
    
    state = {modelLoaded: false}

    loadModel = () => {
        if (this.state.modelLoaded == false) {
            this.props.onLoadModel(this.props.id);
            this.setState({modelLoaded: true});
        }
        else {
           this.props.onUnloadModel(this.props.id);
           this.setState({modelLoaded: false});
        }
    }

    render() {
        // TODO: Display params like temp/repetition penalty and allow editing 
        // TODO: Make switch unload and load model based on setting
        return (
            <div onClick={this.click}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                    <Typography>{this.props.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            <FormGroup>
                                <FormControlLabel control={<Switch onChange={this.loadModel}/>} label="Load model" />
                            </FormGroup>
                            <Stack spacing={1}>
                                <Typography>Model path</Typography>
                                <Chip label={this.props.model_path}/>
                                <Typography>Prompt path</Typography>
                                <Chip label={this.props.prompt_path}/>
                            </Stack>
                            <Typography>Temperature</Typography>
                            <Slider
                                valueLabelDisplay="auto"
                                defaultValue={this.props.temp}
                                min={0}
                                max={1}
                                step={0.001}
                            >
                            </Slider>
                            <Typography>Max number of tokens in response</Typography>
                            <Slider
                                valueLabelDisplay="auto"
                                defaultValue={this.props.num_tokens}
                                min={0}
                                max={500}
                                step={1}
                            >
                            </Slider>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                justifyContent="center"
                            >
                                <TextField
                                    hiddenLabel
                                    id="filled-hidden-label-small"
                                    label="top_k"
                                    defaultValue={this.props.top_k}
                                    size="small"
                                />
                                <TextField
                                    hiddenLabel
                                    id="filled-hidden-label-small"
                                    label="top_p"
                                    defaultValue={this.props.top_p}
                                    size="small"
                                />
                            </Stack>
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </div>
        )
    }
}