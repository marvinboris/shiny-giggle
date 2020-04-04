import React, { Component } from 'react'
import AppBar from '../../../components/AppBar/AppBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronRight,faWallet, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col,InputGroup, InputGroupAddon,Form, InputGroupText, Input, Button, Label, FormGroup, Spinner  } from 'reactstrap';
import manpaye from '../../../assets/images/man-paye.png';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';

 class PayementPage extends Component {

    state = {
        loading:false,
        processing:false,
        processPage:<h1>process</h1>
    }

    onSubmitHandler = ()=>{
        this.setState({...this.state, loading:true});
        fetch('https://www.monetbil.africa/pay/v2.1/gKznLEpbkBj7EOXVxx3WvH4Yw3Ijuk').then(response=>{
        return response.text();
    }).then(html=>{
       
        
       
        return html
    }).then(htmlDoc=>{ console.log(htmlDoc);
        
         this.setState({loading:false,processing:true,processPage:<iframe style={{border:'none'}} scrolling="no" width="600px" height="670px" src='https://www.monetbil.africa/pay/v2.1/gKznLEpbkBj7EOXVxx3WvH4Yw3Ijuk'></iframe>})
    })
        .catch(err => console.log(err));
    }

    inputChangeHandler = (e, name) => {
        this.setState({ [name]: e.target.value });
    }

    render() {
        let loading = <Spinner color="warning"/>
        let processing = this.state.processPage
       let payementProcess=
            <Form onSubmit={this.onSubmitHandler}>
            <InputGroup  size='lg outline-0'>
                 <InputGroupAddon  addonType="prepend">
                     <InputGroupText style={{border:'0'}} className="user-input bg-dark" >
                         <FontAwesomeIcon color="#06b0b6" icon={faWallet} /><strong style={{marginLeft:'10px',fontSize:'30px'}}>|</strong> </InputGroupText>
                 </InputGroupAddon>
                 <Input onChange={(e) => this.inputChangeHandler(e, "payement-type")} name="payement-type" type="select" required style={{height:'65px'}} className="text-light bg-dark border-0 ">
                     <option>Pay using Limo account</option>
                     <option>Pay with BTC</option>
                     <option>Mobile payment</option>
                 </Input>
             </InputGroup>
             <br/>
             <InputGroup className="text-left" size="lg">
                 <InputGroupAddon  addonType="prepend">
                     <InputGroupText style={{border:'none'}} className="bg-dark"><FontAwesomeIcon color="#06b0b6" icon={faDollarSign} /> <strong style={{marginLeft:'20px',fontSize:'30px'}}>|</strong></InputGroupText>
                 </InputGroupAddon>
                 <Input onChange={(e) => this.inputChangeHandler(e, "amount")} name="amount" required style={{height:'65px' }} type="number" className="bg-dark border-0 text-light"  placeholder="Amount to pay" />
             </InputGroup>
             <br/>
             <FormGroup row>
                 <Label className='text-light' for="checkbox2" xs={4}>OTB Method</Label>
                 <Col xs={{ size: 8 }}>
                     <Row>
                     <Col xs={5} >
                         <FormGroup check>
                             <Label className="text-light" check>
                             <Input required name="radio" type="radio" id="checkbox2" />{' '}
                                 SMS
                             </Label>
                         </FormGroup>
                     </Col>
                     <Col xs={5} >
                         <FormGroup check>
                             <Label className="text-light" check>
                             <Input required name="radio" type="radio" id="checkbox2" />{' '}
                             Email
                             </Label>
                         </FormGroup>
                     </Col>
                     </Row>
                 </Col>
             </FormGroup>
             <br/>
             <Button style={{backgroundColor: "#06b640"}} className="float-left h-75"  size=" w-75 ">
                 <h3 >Continue <FontAwesomeIcon icon={faChevronRight}/><FontAwesomeIcon icon={faChevronRight}/></h3>
             </Button>
            </Form>
        if(this.state.loading ) {
            payementProcess = loading
        }
        else if(this.state.processing){
            payementProcess = processing;
        }
        return (
            <div>
                <style>
                    {
                        `
                        .dot-warning{
                            height: 10px;
                            width: 10px;
                            top:-21px;
                            left: 80px;
                        }
                        .paye-v-line{
                            font-family: 'Montserrat', sans-serif;
                            height: 500px;
                            width: 1px;
                            background-color: rgba(243, 243, 243, 0.658)!important;
                            margin-left:190px;
                        }
                        .mancompute {
                            margin-left:100px!important;
                        }
                        .payement-checkbox{
                            margin-left:14px
                        }
                        `
                    }
                </style>
                <AppBar/>
                <Container>
                    <Row>
                        <Col xs={1}>
                            <FontAwesomeIcon className="w-50 h-50 text-right m-0 p-0" color="#06b640" icon={faCheckCircle} />
                        </Col>
                        <Col className=" home-page mb-5" xs={5}>
                            <h4 className="text-left text-light"> Well done !  Please make payment and proceed to next step</h4>
                            <div className="inderline">
                                <hr className="bg-secondary"/>
                                <div className="dot-warning bg-warning rounded-circle position-relative"></div>
                            </div>
                        </Col>
                        <Col xs={12}>
                           <Row>
                               <Col xs={5}>
                                    {payementProcess}
                               </Col>

                               <Col xs={1}>
                                    <div className="paye-v-line float-left"></div>
                                </Col>                       
                               <Col className="float-right" xs={6}>
                                    <img className="mancompute float-right img-fluid" alt="mancompute" src={manpaye} />
                              </Col>
                           </Row>
                           
                       </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


const mapStateToProps = state => {
    console.log(state.auth);
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        getPayementPage: () => dispatch(actions.getPayementPage)
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayementPage);