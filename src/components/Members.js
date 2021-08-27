import { Card, ListGroup, CardDeck, Button, Modal, Container, Row, Col } from 'react-bootstrap'
import React, { useState } from 'react'
import firebase from '../firebase'

export default function Members(){
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [show, setShow] = useState(false)
  const [member, setMember]= useState(null)

  async function renderList(){
    var membersList = []
    var mems = await firebase.database().ref('/members')
    mems.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var key = childSnapshot.key
        var data = childSnapshot.val()
        membersList.push({key: key, data: data})
      })
      console.log(membersList)
        setList(membersList)
        setLoading(false)
    })
  }
  const handleClose = () => setShow(false)
  const handleShow = (e) => {
    setMember(list[e.target.name])
    setShow(true)
  }

  function RenderModalDetails(){
    const reservedDates = member.data.datesReserved
    return(
      <Row>
        <Col xs={3} md={2}>
          {reservedDates.date.date}
        </Col>
        <Col xs={3} md={2}>
          {reservedDates.date.startTime}
        </Col>
        <Col xs={3} md={2}>
          {reservedDates.date.endTime}
        </Col>
        <Col xs={6} md={4}>
          {reservedDates.date.notes} 
        </Col>
        <Col>
          <Button variant='secondary'>Add note</Button>
        </Col>
      </Row>
    )
  }

  function DetailsModal(){
    return(
      member ?
      <Modal size='lg' show={show} onHide={ ()=> {handleClose()}} animation={false}>
        <Modal.Header closeButton closeLabel=''>
          <Modal.Title>{member.key}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <RenderModalDetails/>
          </Container>
        </Modal.Body>
      </Modal>
      : null
      ) 
    }
  if (loading){
    renderList()
  }
  return(
    loading ? null : 
    <div>
      <DetailsModal/>
      <CardDeck style={{display: 'flex', flexWrap: 'wrap'}}>  
        {list.map((value, index)=> {
          return (   
            <Card key={index} style={{margin: '8px', backgroundColor: value.data.paid ? "lightGreen" :'pink', minWidth: '280px'}}>
              <Card.Body>
                <Card.Title>{value.key}</Card.Title>
                <ListGroup variant='flush'>
                  <ListGroup.Item>{value.data.phone}</ListGroup.Item>
                  <ListGroup.Item>{value.data.address}</ListGroup.Item>
                  <ListGroup.Item>{value.data.email}</ListGroup.Item>
                  <ListGroup.Item>Fam. Members {value.data.numOFam || '1'}</ListGroup.Item>
                  <Button variant='primary' onClick={(e)=> {handleShow(e)}} name={index}>Details</Button>
                </ListGroup>
              </Card.Body>
            </Card> 
          )
        })}
      </CardDeck>   
    </div>
  )
}