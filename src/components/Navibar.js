import React from 'react'
import { Nav, Button, NavDropdown } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import {useHistory} from 'react-router-dom'

export default function Navigation(props) {
const { logout, currentUser } = useAuth()
const history = useHistory()
  async function handleLogout(){
    try {
      console.log('handling Logout')
      await logout() 
    } catch {
    }
    history.push('./login')
  }
  
  return (
<Nav defaultActiveKey="/home" className="flex-column">
  <label style={{minHeight: '100px'}}> </label>
  <Nav.Link href="/">Home</Nav.Link>
  {currentUser ? 
  <Button className='nav-link' variant='nav-link' style={{textAlign: 'left'}} onClick={handleLogout}>
    Logout
  </Button> : 
      <Nav.Link href="/login">Login</Nav.Link> 
  }
  {currentUser?
  <div style={{border: 'solid black 1px'}}>
    <Nav.Link href='/userInfo'>User Info</Nav.Link>
    <Nav.Link href='/calendar'>Calendar</Nav.Link>
    <Nav.Link href='/requests'>Requests</Nav.Link>
    {currentUser.providerData[0].uid === 'admin@test.com'? 
      <NavDropdown title="Admin" id="nav-dropdown">
          <NavDropdown.Item eventKey="4.1" href='/members'>    
            Members
          </NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" href='/schedule'>
            Set Schedule
          </NavDropdown.Item>
      </NavDropdown>: 
    null}
  </div>
  :
  <Nav.Link href="/signup">Signup</Nav.Link>}
</Nav>
  )
}
