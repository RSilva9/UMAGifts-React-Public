import { Navbar, Nav, Offcanvas } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function UserNav() {
  return (
    <>
        <Navbar expand="lg" className='userNavbar'>
            <div className="d-none d-md-flex w-100">
                <Nav className="navItems ms-auto">
                  <Link to="/cuenta" active="false">Cuenta</Link>
                </Nav>
            </div>
        </Navbar>
    </>
  );
}

export default UserNav