import React from 'react';
import {
    Navbar,
    NavbarBrand,
   
  } from 'reactstrap';
  import "./AppBar.css";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  
  import {faChartLine,faMoneyBillWave} from '@fortawesome/free-solid-svg-icons'

export default function AppBar() {
    return (
        <div>
            <Navbar   style={{backgroundColor:"#012024"}} light expand="md">
                <NavbarBrand className="ml-4"  href="/"><strong className="navbar-text-1">
                    <FontAwesomeIcon color="#f5a10e" icon={faMoneyBillWave} /> INVEST</strong><strong className="navbar-text-2"> CALC <FontAwesomeIcon icon={faChartLine} /></strong>
                    <i className="d-block small text-light subtitle">Liyeplimal Reinvestment Calculator</i>
                </NavbarBrand>
            </Navbar> 
            <hr className=" bg-secondary h-line w-100 " />
            java
        </div>
    )
}
