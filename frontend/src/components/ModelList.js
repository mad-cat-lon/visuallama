import * as React from 'react';


import { Model } from './Model';

export class ModelList extends React.Component {

    render() {
        let list = <div className="no-content-message">There are no models to show</div>;
        if (this.props.models && this.props.models.map) {
            list = this.props.models.map(m => 
            <Model 
            key={m.id}
            id={m.id}
            name={m.name}
            model_path={m.model_path}
            prompt_path={m.prompt_path}
            top_k={m.top_k}
            top_p={m.top_p}
            num_tokens={m.num_tokens}
            repeat_penalty={m.repeat_penalty}
            repeat_penalty_num_tokens={m.repeat_penalty_num_tokens}
            temp={m.temp}
            onLoadModel={this.props.onLoadModel}
            onUnloadModel={this.props.onUnloadModel}/>
        )}
                
        return (
            <div>
                {list}
            </div>);
    }

}