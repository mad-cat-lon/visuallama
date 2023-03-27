import React from 'react';

export class Model extends React.Component {

    click = () => {
        this.props.onClick(this.props.id);
    }

    render() {
        return (
            <div className='model-item' onClick={this.click}>
                <div>{this.props.name}</div>
                <span><b>model path:</b> {this.props.model_path}<br /></span>
                <span><b>prompt path:</b> {this.props.prompt_path}</span>
            </div>
        )
    }
}