import './PopUp.css';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faList, faArrowDown, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';

class Menubar extends Component {
  constructor() {
    super();
    this.state = {
      clicked: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }
  handleClick(index, e) {
    let clicked = this.state.clicked;
    clicked[index] = !clicked[index]
    this.setState({ clicked: clicked });
  }
  handleOutsideClick(event) {
    if (!this.refs.megaMenu.contains(event.target)) {
      this.setState({
        clicked: []
      });
    }
  }
  render() {
    return (
      <div className="menu-bar-item" ref="megaMenu">
        <a className="menu-bar-link" style={{ backgroundColor: this.props.bg, fontFamily: 'Poppins' }} href="#" onClick={this.handleClick.bind(this, 0)}><FontAwesomeIcon icon={faArrowCircleDown} /></a>
        <div className={"mega-menu" + " " + this.state.clicked[0]}>
          <div className="mega-menu-content">
            <div className="text-break">{this.props.data.join(" + ")} </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Menubar;