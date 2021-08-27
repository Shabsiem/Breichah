import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"
import firebase from '../firebase'

export default function UserInfo() {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [family, setFamily] = useState(1)
  const history = useHistory()
  const user = useAuth()

  useEffect(()=> {
    setEmail(user.currentUser.email)
    getData()    
  },[user.currentUser.email])

  function getData(){
    firebase.database().ref().child('members/').get().then((snapshot)=>{
      console.log(email)

      let data = snapshot.val()
      console.log(data)
      for (var x = 0; x < data.length; x ++){
        console.log(data[x].email)
      }
    })  
  }

  function onChange(e){
    switch(e.target.name){
      case 'name':
        setName(e.target.value)
        break;
      case 'email':
        setEmail(e.target.value)
        break;
      case 'address':
        setAddress(e.target.value)
        break;
      case 'phone':
        setPhone(e.target.value)
        break;
      case 'familyNum':
        setFamily(e.target.value)
        break;
      default:
        break;
    }
  }

  async function handleSubmit(e){
    e.preventDefault()
    await firebase.database().ref(`/members/${name}`).set({
      name: name, 
      email: email,
      phone: phone,
      address: address,
      numOFam: family,
      paid: false,
      datesReserved:[]
    })
    history.push('/dashboard')
  }
  return( loading ? null : 
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Name" name='name' value={name} onChange={onChange} required/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label><br/>
          <Form.Label className='form-control'>{email}</Form.Label>
        </Form.Group>
      </Form.Row>

      <Form.Row>
      <Form.Group controlId="formGridAddress1">
        <Form.Label>Address</Form.Label>
        <Form.Control placeholder="1234 Main St" name='address' value={address} onChange={onChange} required/>
      </Form.Group>

      <Form.Group as={Col} controlId="formGridPhone">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="phone" placeholder="phone" name='phone' value={phone} onChange={onChange} required/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridFamily">
          <Form.Label>Family Members</Form.Label>
          <Form.Control as="select" defaultValue="Number of" name='familyNum' value={family} onChange={onChange} required>
            <option>Only me</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}
