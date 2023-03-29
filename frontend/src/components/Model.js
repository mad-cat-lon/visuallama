import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
export class Model extends React.Component {
    
    loadModel = () => {
        this.props.onSelectModel(this.props.id);
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
                        <FormGroup>
                            <FormControlLabel control={<Switch onChange={this.loadModel}/>} label="Load model" />
                        </FormGroup>
                        <span><b>model path:</b> {this.props.model_path}<br /></span>
                        <span><b>prompt path:</b> {this.props.prompt_path}</span> 
                    </AccordionDetails>
                </Accordion>
            </div>
        )
    }
}