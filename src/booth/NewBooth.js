import React, { Component } from 'react';
import {createBooth} from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewBooth.css';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class NewBooth extends Component {

    constructor(props){
        super(props)
        this.state = {
                booth:{title:''},
                products:[{title:''},{title:''}],
                };

        this.addProduct = this.addProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBoothChange = this.handleBoothChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    addProduct(event){
        const products = this.state.products.slice();
        this.setState({
        products: products.concat([{title:''}])
        });
    }

    removeProduct(productNumber){
        const products = this.products.slice();
        this.setState({
            products:[...products.slice(0, productNumber), ...products.slice(productNumber+1)]
        });
    }

    handleSubmit(event){
        event.preventDefault();
        const boothData={
            booth: this.state.title,
            products : this.state.products.map(product => {
            return {title: product.title}
            }),
        };

        createBooth(boothData)
        .then(response => {this.props.history.push("/")})
        .catch(error => {
                if(error.status ===401){
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create booth.');
                } else {
                    notification.error({
                        message: 'booth App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                }
        });
    }



    validationBooth = (boothTitle) => {
        if(boothTitle.length == 0)
        {
            return {
                     validateStatus: 'error',
                    errorMsg: 'Please enter your title!'
            }
        } else if (boothTitle.length > POLL_QUESTION_MAX_LENGTH) {
                    return {
                        validateStatus: 'error',
                        errorMsg: 'Booth is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)'
                    }
                } else {
                    return {
                        validateStatus: 'success',
                        errorMsg: null
                    }
                }
        }


    handleBoothChange(event) {
        const value = event.target.value;
        this.setState({
            booth: {
                title: value,
                ...this.validateQuestion(value)
            }
        });
    }

    validateProduct = (productTitle) => {
        if(productTitle.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a title!'
            }
        } else if (productTitle.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: 'product is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)'
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleProductChange(event, index) {
        const products = this.state.products.slice();
        const value = event.target.value;

        products[index] = {
            title: value,
            ...this.validateProduct(value)
        }

        this.setState({
            products: products
        });
    }

    isFormInvalid() {
            if(this.state.product.validateStatus !== 'success') {
                return true;
            }

            for(let i = 0; i < this.state.products.length; i++) {
                const product = this.state.products[i];
                if(product.validateStatus !== 'success') {
                    return true;
                }
            }
    }

    render() {

        const productViews = [];
        this.state.products.forEach((product, index) => {
productViews.push(<BoothProduct key={index} product={product} productNumber={index} removeProduct={this.removeProduct} handleProductChange={this.handleProductChange}/>);
        });


        return (
            <div className="new-booth-container">
            <h1 className="page-title">Create Booth</h1>
            <div className="new-poll-content">

            <Form onSubmit={this.handleSubmit} className="create-poll-form">
            <FormItem validateStatus={this.state.booth.validateStatus} help={this.state.booth.errorMsg} className="poll-form-row">

            <TextArea
                    placeholder="Enter your booth Title"
                    style = {{ fontSize: '16px' }}
                    autosize={{ minRows: 3, maxRows: 6 }}
                    name = "booth"
                    value = {this.state.booth.text}
                    onChange = {this.handleBoothChange} />
            </FormItem>

            {productViews}

            <FormItem className="poll-form-row">
                <Button type="dashed" onclick={this.addProduct} disabled={this.state.products.length == MAX_CHOICES}>
                    <Icon type="push" /> add product
                </Button>
            </FormItem>

            <FormItem className="poll-form-row">
                    <Col xs={24} sm={4}>
                        Booth length:
                    </Col>
            </FormItem>

            <FormItem className="poll-form-row">
                            <Button type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={this.isFormInvalid()}
                                className="create-poll-form-button">Create Booth</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

function BoothProduct(props) {
    return (
        <FormItem validateStatus={props.product.validateStatus}
        help={props.product.errorMsg} className="poll-form-row">
            <Input
                placeholder = {'Choice ' + (props.productNumber + 1)}
                size="large"
                value={props.product.text}
                className={ props.productNumber > 1 ? "optional-choice": null}
                onChange={(event) => props.handleProductChange(event, props.productNumber)} />

            {
                props.productNumber > 1 ? (
                <Icon
                    className="dynamic-delete-button"
                    type="close"
                    disabled={props.productNumber <= 1}
                    onClick={() => props.removeProduct(props.productNumber)}
                /> ): null
            }
        </FormItem>
    );
}


export default NewBooth;