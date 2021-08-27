import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }
    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      history.push("/userinfo")
    } catch {
      setError("Failed to create an account")
    }
    setLoading(false)
  }
  
  const handleClose = () => setShow(false)
  const handleShow = () => {
    setShow(true)
  }

    function TermsModal(){
    return(
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton closeLabel=''>
          <Modal.Title>Swimming Pool Waiver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="center"><strong>WAIVER AND REALEASE OF LIABILITY FORM<br/>
            RELEASE OF LIABILITY, WAIVE OF CLAIMS,<br/>
            ASSUMPTION OF RISK AND INDEMNITY AGREEMENT</strong></p>
          <p className="center"><strong>BY SIGNING THIS DOCUMENT YOU WILL WAIVE CERTAIN LEGAL <br/>
            RIGHTS, INCLUDING THE TIGHT TO SUE</strong></p>
          <strong>ASSUMPTION OF RISK:</strong>
          <ol>
              <li>I, the undersigned, wish to use the Moskovitz Pool; I recognize that playing 
                  at the Moskovitz Pool involves certain risks. Those risks include, but are not 
                  limited to, the risk of injury resulting from possible malfunction of the equipment used in the 
                  pool and injuries resulting from tripping or falling over obsticles in the pool areas.</li>
          </ol>
          <p>
              RELEASE OF LIABILITY, WAIVER OF CLAIMS AND INDEMNITY AGREEMENT inconsideration of my families' participation in this passtime, I hereby agree as follows:
          </p>
          <ol>
              <li> <strong>TO WAIVE ANY AND ALL CLAIMS</strong> that I have or may have in the future against the 
              Moskovitz family, their officers, employees, agents and representatives (all of whom are 
              hereinafter referred to as "the Releasees").
              </li><br/>
              <li><strong>TO RELEASE THE RELEASEES</strong> from any and all liability for any loss, damage, injury or 
              expense that I may suffer or that my next of kin may suffer from as a result of my families' 
              participation at the Moskovitz Swimming Pool due to any cause whatsoever, <strong>INCLUDING 
              NEGLIGENCE ON THE PART OF THE RELEASEES</strong>;
              </li><br/>
              <li><strong>TO HOLD HARMLESS AND INDEMNIFY THE RELEASEES</strong> from any and all liability
              from any damage to property of, or personal injury to, any third party, resulting from my 
              participation at the Swimming Pool.
              </li><br/>
              <li>That this Agreement shall be effective and binding upon my heirs, and their next of kin, executors, 
              administrators and assigns, in the event of any death.  
              </li>
          </ol>
        </Modal.Body>
      </Modal>
      )
    }

  return (
    <div className="w-100" style={{ maxWidth: "400px" }}>
      <Card >
        <TermsModal/> 
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Form.Group id='agree-terms'>
              <Form.Check type="checkbox" label={<label onClick={handleShow}>I agree to the <strong style={{color: 'blue', style: 'underline'}}>Terms and Conditions</strong>.</label>} required/>
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  )
}