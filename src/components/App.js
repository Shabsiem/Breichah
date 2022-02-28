import React, { useState } from "react"
import { Switch, Route, Redirect, useHistory, useLocation } from "react-router-dom"
import { Container, Row, Col } from 'react-bootstrap'
import Signup from "./Signup"
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import Terms from './Terms'
import UserInfo from './UserInfo'
import Navigation from './Navibar'
import Members from './Members'
import Schedule from './Schedule'
import Calendar from './Calendar/Calendar'
import { useAuth } from '../contexts/AuthContext'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [redirectToReferrer, setRedirectToReferrer] = useState(false)
  const [error, setError] = useState('')
  const { logout } = useAuth()
  const history = useHistory()
  const { state } = useLocation()

  async function handleLogout(){
    try {
      console.log('handling Logout')
      setError("")
      await logout()    
      setIsAuthenticated(false)
      setRedirectToReferrer(false)
      history.push("/login")
    } catch {
      setError("Failed to log out")
      console.log(error)
    }
  }

  function PrivateRoute({children, ...rest}){
    if (useAuth().currentUser){
      setIsAuthenticated(true)
      if (redirectToReferrer){
        return <Redirect to={state?.from || '/calendar'}/>
      } 
    }
    else{    
      setRedirectToReferrer(true)
      history.push('/login')
    }

    return(
      <Route {...rest} render={({ location }) => {
        console.log("LOOK HERE")
        console.log(location)
        return isAuthenticated === true
        ? children
        : <Redirect to={{
          pathname: '/login',
          state: {from: location}
        }} />
      }} />
    )
  }

  return (
    <Container>
      <div>         
            <Row>
              <Col lg={2} id='sidebar-wrapper' style={{width: '15%'}}>
                <Navigation
                  logout = {handleLogout}/>              
              </Col>
              <Col l={10} id='page-content-wrapper'>
                <Switch>
                  <Route path='/signup' component={Signup}/>
                  <Route path='/login' component={Login}/>
                  <Route path='/forgotpassword' component={ForgotPassword}/>
                  <Route path='/terms' component={Terms}/>
                  <Route path='/calendar' component={Calendar}/>
                  <PrivateRoute path='/members' component={Members}/>
                  <PrivateRoute path='/userinfo' component={UserInfo}/>
                  <PrivateRoute path='/calendar' component={Calendar}/>
                  <PrivateRoute path='/schedule' component={Schedule}/>
                </Switch>                
              </Col>
            </Row>
      </div>
    </Container>
  );
}

export default App;
