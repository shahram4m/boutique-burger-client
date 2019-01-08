import React, { Component } from 'react';
import './NewBooth.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class Booth extends Component {
    render() {
        return (
            <div className="page-not-found">
                <h1 className="title">
                    Booth page not found  404
                </h1>
                <div className="desc">
                    The Page you are looking for was not found.
                </div>
                <Link to="/"><Button className="go-back-btn" type="primary" size="large">Go Back</Button></Link>
            </div>
        );
    }
}
export default Booth;