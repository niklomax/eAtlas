/**
 * geoplumber R package code.
 */
import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
function Header(props) {
  const [dark, setDark] = useState(props.dark)
  return (
    <Navbar inverse={dark} collapseOnSelect>
        <Nav pullRight>
          <Link to="/">
            <img className="logo-standard" style={{height: "46px", maxHeight:"46px"}} 
            src="https://lida.leeds.ac.uk/wp-content/themes/lida/resources/images/uol-logo.png" />
            <img className="logo-mobile" style={{height: "46", maxHeight:"46"}} 
            src="https://lida.leeds.ac.uk/wp-content/themes/lida/resources/images/uol-logo-sml.png" />
          </Link>
        </Nav>
    </Navbar >
  )
}

// thanks to https://stackoverflow.com/a/42124328/2332101
export default withRouter(Header);
