import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Block from './Block';



class Blocks extends Component{
    state={blocks:[]};

    componentDidMount() {
        fetch(`${document.location.origin}/api/blocks`).then(response=> response.json()).then(json =>this.setState({blocks: json}));

    }

    render(){

        console.log('this.state', this.state);
        
        return (
            <div>
                <h3>Blocks-Info</h3>
                {
                    this.state.blocks.map(block => {
                        return(
                            <Block key={block.hash} block={block} />
                        )

                    })

                }
            </div>
        );
    }

}

export default Blocks;