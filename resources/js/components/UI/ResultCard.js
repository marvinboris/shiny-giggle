import React from 'react';
import { Badge, Jumbotron, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faFolder, faWallet,faCalendar } from '@fortawesome/free-solid-svg-icons'

export default function ResultCard(props) {
    return (
        <Col className="mt-3" xs={3}>
            <Jumbotron style={{backgroundColor:props.bg}} className="h-100 p-1">
                    <h5  style={{backgroundColor:"#F5A10E"}} className="p-1 text-left  w-100"><FontAwesomeIcon icon={faCalendar}/> Week {props.week}</h5>
                    <p className="text-left">Total Payout: ${props.payout}</p>
                    <p className="p-0  text-left">Bal w1: ${props.balw}</p>
                    <p className="p-0  text-left">Total Bal: {props.totBal}</p>
                    <p className="p-0  text-left">invest: {props.invest} </p>
                    <p className="p-0  text-left">Rem: {props.rem}</p>
                    <h5 className="rounded" style={{backgroundColor:'#05C945'}} className="p-1  w-100"><FontAwesomeIcon icon={faWallet}/> W{props.week} Bal: {props.balw}</h5>
                    <hr/>
                    <p className="text-left">Total Packages:</p>
                    <div>
                        <FontAwesomeIcon className="float-left" size="2x" color="#05C945" icon={faFolder}></FontAwesomeIcon>
                        <Badge className="badge rounded-circle" href="#" color="danger">1</Badge>
                    </div>
            </Jumbotron>
        </Col>
       
    )
}
