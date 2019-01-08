import React, { Component } from 'react';
import { createBooth } from '../util/APIUtils';
import { uploadFile } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewBooth.css';
import { Upload, Form, Input, Button, Icon, Select, Col, notification } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class NewBooth extends Component {

    constructor(props) {
        super(props)
        this.state = {
            booth: { title: '' },
            products: [{
                title: '',
                description: '',
                file: null,
                price: 0,
                fileId: '',
            }, {
                title: '',
                description: '',
                file: null,
                price: 0,
                fileId: '',
            }],
            serverFileId: 0,
            value: '',
            list: ['a', 'b', 'c'],
        };

        this.addProduct = this.addProduct.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBoothChange = this.handleBoothChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.upfile = this.upfile.bind(this);
    }

    addProduct(event) {

        const products = this.state.products.slice();
        this.setState({
            products: products.concat([{
                title: '',
                description: ''
            }])
        });
    }

    removeProduct(productNumber) {
        const products = this.state.products.slice();
        this.setState({
            products: [...products.slice(0, productNumber), ...products.slice(productNumber + 1)]
        });
    }

    async upfile(file) {
        uploadFile(file)
            .then((response) => {
                this.setState({ value: response.id });
                4
            })
            .catch(error => {
                if (error.status === 401) {
                    this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create booth.');
                } else {
                    notification.error({
                        message: 'booth App',
                        description: error.message || 'Sorry! Something went wrong in file upload. Please try again!'
                    });
                }
            });

        return this.state.value;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async handleSubmit(event) {
        event.preventDefault();
        var list = [];

        const boothData = {
            title: this.state.booth.title,
            products: await this.state.products.reduce(async (promise, product) => {
                await promise;
                const contents = await this.upfile(product.file)
                await this.sleep(1000);

                let newProduct = { title: product.title, description: product.description, price: product.price, fileId: this.state.value };
                list = [...list, newProduct];
                return list;
            }, Promise.resolve())
        };

        //console.log("boothData is=:"+JSON.stringify(boothData));
        //TODO get id from server and bind file id in product        
        //TOTO  UploadFileResponse = JSON.parse("uploadFileResult");    
        //save booth
        createBooth(boothData)
            .then(response => { this.props.history.push("/") })
            .catch(error => {
                if (error.status === 401) {
                    this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create booth.');
                } else {
                    notification.error({
                        message: 'booth App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                }
            });
    }

    validateBooth = (boothTitle) => {
        if (boothTitle.length == 0) {
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
                ...this.validateBooth(value)
            }
        });
    }

    validateProduct = (productTitle) => {
        if (productTitle.length === 0) {
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

    validateDescription = (productDescription) => {
        if (productDescription.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a productDescription!'
            }
        } else if (productDescription.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: 'productDescription is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)'
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
            description: products[index].description,
            title: value,
            price: products[index].price,
            file: products[index].file,
            ...this.validateProduct(value)
        }

        this.setState({
            products: products
        });
    }

    handleDescriptionChange(event, index) {
        const products = this.state.products.slice();
        const value = event.target.value;

        products[index] = {
            title: products[index].title,
            description: value,

            price: products[index].price,
            file: products[index].file,


            ...this.validateDescription(value)
        }

        this.setState({
            products: products
        });
    }

    handlePriceChange(event, index) {
        const products = this.state.products.slice();
        const value = event.target.value;

        products[index] = {
            description: products[index].description,
            title: products[index].title,
            price: value,
            file: products[index].file,
            ...this.validateDescription(value)
        }

        this.setState({
            products: products
        });
    }

    handleFileChange(event, index) {
        //console.log('not an handleFileChange');
        const products = this.state.products.slice();
        const value = event.target.files[0];

        products[index] = {
            description: products[index].description,
            title: products[index].title,
            price: products[index].price,
            file: value,
            ...this.validateProduct(value)
        }

        this.setState({
            products: products
        });

        //  console.log('not an handleFileChange');
        //  if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
        //      alert('not an image');

    }

    isFormInvalid() {
        if (this.state.products.validateStatus !== 'success') {
            return true;
        }

        for (let i = 0; i < this.state.products.length; i++) {
            const product = this.state.products[i];
            if (product.validateStatus !== 'success') {
                return true;
            }
        }
    }

    onFileChange = (event) => {
        console.log('not an imag32dsfsefe');


        if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i))
            alert('not an image');


        this.setState({
            file: event.target.files[0]
        });
    }



    render() {

        const productViews = [];
        this.state.products.forEach((product, index) => {
            productViews.push(<BoothProduct key={index} product={product} productNumber={index} removeProduct={this.removeProduct}
                handleProductChange={this.handleProductChange}
                handleDescriptionChange={this.handleDescriptionChange}
                handlePriceChange={this.handlePriceChange}
                handleFileChange={this.handleFileChange} />);
        });


        return (
            <div className="new-poll-container">
                <h1 className="page-title">Create Booth</h1>
                <div className="new-poll-content">

                    <Form onSubmit={this.handleSubmit} className="create-poll-form">
                        <FormItem validateStatus={this.state.booth.validateStatus} help={this.state.booth.errorMsg} className="poll-form-row">

                            <TextArea
                                placeholder="Enter your booth Title"
                                style={{ fontSize: '16px' }}
                                autosize={{ minRows: 3, maxRows: 6 }}
                                name="booth"
                                value={this.state.booth.title}
                                onChange={this.handleBoothChange} />
                        </FormItem>

                        {productViews}

                        <FormItem className="poll-form-row">
                            <Button type="dashed" onClick={this.addProduct} disabled={this.state.products.length == MAX_CHOICES}>
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

                                className="create-poll-form-button">Create Booth</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

//disabled={this.isFormInvalid()}
function BoothProduct(props) {

    return (
        <FormItem validateStatus={props.product.validateStatus}
            help={props.product.errorMsg} className="poll-form-row">
            <div>
                <Input
                    placeholder={'Product ' + (props.productNumber + 1)}
                    size="large"
                    value={props.product.title}
                    className={props.productNumber > 1 ? "optional-choice" : null}
                    onChange={(event) => props.handleProductChange(event, props.productNumber)} />

                <Input
                    placeholder={'description ' + (props.productNumber + 1)}
                    size="large"
                    value={props.product.description}
                    //className={ props.productNumber > 1 ? "optional-choice": null}
                    onChange={(event) => props.handleDescriptionChange(event, props.productNumber)} />

                <Input
                    placeholder={'price ' + (props.productNumber + 1)}
                    size="large"
                    value={props.product.price}
                    //className={ props.productNumber > 1 ? "optional-choice": null}
                    onChange={(event) => props.handlePriceChange(event, props.productNumber)} />

                {/* <Upload onChange={(event) => props.handleFileChange(event, props.productNumber)}>
                <Button>
                    <Icon type="upload" /> Upload Photo
                </Button>
                </Upload > */}

                <div className="App-intro">
                    <h3>Upload a file</h3>
                    <input onChange={(event) => props.handleFileChange(event, props.productNumber)} type="file"></input>
                </div>

                {
                    props.productNumber > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="close"
                            disabled={props.productNumber <= 1}
                            onClick={() => props.removeProduct(props.productNumber)}
                        />) : null
                }
            </div>
        </FormItem>
    );
}


export default NewBooth;