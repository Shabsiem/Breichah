import { Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import './calendar.css'
import { useAuth } from "../../contexts/AuthContext"
import firebase from '../../firebase'

export default function Calendar() {

  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [yearSchedule, setYearSchedule] = useState([])
  const [show, setShow] = useState(false)
  const [selectionDate, setSelectionDate] = useState({})
  const [selectionTime, setSelectionTime] = useState({})
  const [name, setName]= useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [family, setFamily] = useState(1)
  const [validated, setValidated] = useState(false);
  const [basePrice, setBasePrice] = useState(0)
  const [addGuestPrice, setAddGuestPrice] = useState(0)
  const [addGuest, setAddGuest] = useState(0)
  const user = useAuth()
  const date = new Date()
  const prevLastDay = new Date(date.getFullYear(),selectedMonth,0).getDate()
  const firstDayIndex = new Date(date.getFullYear(),selectedMonth,1).getDay()
  const lastDayIndex = new Date(date.getFullYear(),selectedMonth +1, 0).getDay()

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  useEffect(() => {
    getData()

  }, [])
  const getData = ()=>{
    firebase.database().ref().get().then((snapshot)=>{
      let allData = snapshot.val()
      setYearSchedule(allData.schedule)
      let data = Object.values(snapshot.val().members)
      let person = data.filter(people => people.email === user.currentUser.email)
      setName(person[0].name)
      setAddress(person[0].address)
      setFamily(person[0].numOFam)
      setPhone(person[0].phone)
      setLoading(false)
      setBasePrice(allData.prices.baseRental)
      setAddGuestPrice(allData.prices.addGuest)

    })
  }
  // code for creating the calendar in the database... to be used on an admin setup page
  // var schedule = []
  // for (var m = 8; m < 9; m++){
  //   for (var s = 1; s < 32 ; s++){
  //     let date = new Date(`${m} ${s} ${new Date().getFullYear()}`)
  //     const dow = date.getDay()
  //     const weekday = [
  //       {id: 0, stime: '10:00' ,etime: '12:15',purpose: 'Women', reservable: false},
  //       {id: 1, stime: '12:30' ,etime: '14:00',purpose: 'Men', reservable: false},
  //       {id: 2, stime: '14:15' ,etime: '15:15',purpose: 'Rental', reservable: true},
  //       {id: 3, stime: '15:30' ,etime: '17:00',purpose: 'Women', reservable: false},
  //       {id: 4, stime: '17:15' ,etime: '18:30',purpose: 'Men', reservable: false},
  //     ]
  //     const sunday = [
  //       {id: 0, stime: '10:00' ,etime: '11:00',purpose: 'Rental', reservable: true},
  //       {id: 0, stime: '11:15' ,etime: '12:15',purpose: 'Rental', reservable: true},
  //       {id: 0, stime: '12:30' ,etime: '13:30',purpose: 'Rental', reservable: true},
  //       {id: 0, stime: '13:45' ,etime: '14:45',purpose: 'Rental', reservable: true},
  //       {id: 0, stime: '15:00' ,etime: '16:00',purpose: 'Rental', reservable: true},
  //       {id: 0, stime: '16:15' ,etime: '17:15',purpose: 'Rental', reservable: true},
  //       {id: 0, stime: '17:30' ,etime: '18:30',purpose: 'Rental', reservable: true},
  //       {id: 0, stime: '18:45' ,etime: '19:45',purpose: 'Rental', reservable: true},
  //     ]
  //     const shabbos = [
  //       {id: 0, purpose: 'CLOSED', reservable: false}
  //     ]
  //     if (s === 31 && m === 6){
  //     }else{
  //       schedule.push({
  //         month:  m, 
  //         date:  s, 
  //         timesTable: dow > 0 ? dow < 6 ? weekday : shabbos : sunday
  //       })
  //     }
  //   firebase.database().ref(`schedule/${m}`).set(schedule)
  //   }
  // }
  const handleShow = ()=> {setShow(true)}
  const handleClose = ()=>{
    setShow(false)
    setAddGuest(0)
  }

  function ModalForm(props){
        const handleSubmit = (event) => {
          const form = event.currentTarget;
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
      
          setValidated(true);
        };
      
        return (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  disabled= {true}
                  type="text"
                  placeholder={name}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>Number of Immediate Family Members</Form.Label>
                <Form.Control
                  disabled= {true}
                  type="text"
                  placeholder={family}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom03">
                <Form.Label>Total of additional guests</Form.Label>
                <Form.Control type="number" placeholder={addGuest} onChange={(e)=>{setAddGuest(e.target.value)}} required />
                <Form.Control.Feedback type="invalid">
                  If none please write 0.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom04">
                <Form.Label>Base Price</Form.Label>
                <Form.Control type="text" placeholder={basePrice} disabled={true} />
                <Form.Control.Feedback type="invalid">
                  Pool rental price.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom05">
                <Form.Label>Additional guest charge</Form.Label>
                <Form.Control type="text" placeholder={addGuestPrice* addGuest} disabled={true}/>
                <Form.Control.Feedback type="invalid">
                  Please provide a valid zip.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Label>Total: {addGuestPrice*addGuest+basePrice}</Form.Label>
            </Row>
          </Form>
        );
    
  }

  function handleSelect(e, date){
    let selected = date.date.timesTable[e.target.id]
    if (selected.reservable === true) {
      handleShow(selected, date)
      setSelectionDate(date)
      setSelectionTime(e.target.id)
    }else
    {alert('This slot is not available for booking... Try another.')}
  }
function RenderSchedule(date){
  let timeSchedule = []
  for (var x = 0; x < date.date.timesTable.length; x++){
    let specifics = date.date.timesTable[x]
    const message = `${specifics.stime || 'ALL'}-${specifics.etime || 'DAY'} ${specifics.purpose === 'Rental' ? specifics.reservable ?'Rental': 'Booked': specifics.purpose}`
    timeSchedule.push(
      <li key = {`${date} ${x}`} onClick={(e)=>{handleSelect(e,date)}} id={x}
        style={{ backgroundColor: 
        specifics.purpose === 'Rental' ? specifics.reservable ? 'green' : 'red':
          specifics.purpose === 'Women' ? 'pink' : 'blue',
          border: 'solid white 1px', margin: '1px'}}
          >{message}</li>
    )
  }
  return timeSchedule
}

  function RenderDays(){
    const today = new Date().getDate()-1
    let currentMonthDays = []
    if (selectedMonth > 4 && selectedMonth < 8){
    for(let x = firstDayIndex; x>0; x--){
      currentMonthDays.push(<div className='prev-date' onClick={handleNav} key={`lastMonth ${x}`} > {prevLastDay - x +1} </div>)
    }
    for (let q = 0; q < yearSchedule[selectedMonth+1].length; q++){
      currentMonthDays.push(
        <div className= {q === today ? 'today': 'scrollable'} id={q+1} key={q}>{q+1}
             <ul style = {{paddingLeft: '0', paddingTop: '2rem'}}>
              <RenderSchedule
              date= {yearSchedule[selectedMonth+1][q]}/>
             </ul>
        </div>
      )
    }
    for(let y = lastDayIndex; y < 6; y++){
      currentMonthDays.push(
              <div className='next-date' id='next' onClick={handleNav} key={`nextMonth ${y}`}> {y-lastDayIndex+1} </div>
      )
    }
  }else{
    currentMonthDays = <h2 style={{margin: 'auto', paddingTop: '100px'}}>CLOSED UNTIL NEXT SEASON</h2>
  }
    return (currentMonthDays)
  }

  function handleNav(e) {
    if (e.target.name === 'next' || e.target.id === 'next'){
      if(selectedMonth < months.length-1){
        setSelectedMonth(selectedMonth+1)
      }else{
        setSelectedMonth(0)
      }
    }else{
      if (selectedMonth === 0){
        setSelectedMonth(11)
      }else{
        setSelectedMonth(selectedMonth-1)
      }
    }
  }

  function handleSubmit(){
    handleClose()
    alert('Booking Complete')
    console.log(selectionDate)
    console.log(selectionTime)
    console.log(name)
    firebase.database().ref('schedule').child(`${selectionDate.date.month}`).child(`${selectionDate.date.date-1}`).child('timesTable').child(`${selectionTime}`).child('reservable').set(false)
    firebase.database().ref('schedule').child(`${selectionDate.date.month}`).child(`${selectionDate.date.date-1}`).child('timesTable').child(`${selectionTime}`).child('reservedBy').set({name})
    firebase.database().ref('members').child(`${name}`).child('bookings').push(`{date: ${selectionDate.date.month}/${selectionDate.date.date}, time: ${selectionDate.date.timesTable[selectionTime].stime}-${selectionDate.date.timesTable[selectionTime].etime}}`)

  }

  function BookingSideBar(props) {
    let sTime = props.selectionDate.date.timesTable[props.selectionTime].stime
    let eTime = props.selectionDate.date.timesTable[props.selectionTime].etime
    return (
      <>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton closeLabel=''>
            <Modal.Title>Booking Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Please read and confirm these details before filling out the following form: 
            You wish to reserve the pool {props.selectionDate.date.month}/{props.selectionDate.date.date} from {sTime} to {eTime}.
            <ModalForm
            props = {props}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  if (loading){
    return(
      <div>Loading...</div>
    )
  }else{
  return (
  <>
    <div className="container-xl">
      {selectionDate.date?
      <BookingSideBar
        onHide={handleClose}
        show = {show}
        selectionDate = {selectionDate}
        selectionTime = {selectionTime}
        />:null}
      <div className="calendar">
        <div className="month">
          <Button size= 'lg' onClick={handleNav} name='back'>Back</Button>
          <div className="date">
            <h1>{months[selectedMonth]}</h1>
            <p>{new Date().toDateString()}</p>
          </div>
          <button onClick={handleNav} name='next'>Next</button>
        </div>
        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Shabbos</div>
        </div>
        <div className="days">
          <RenderDays/> 
        </div>
      </div>
    </div>
  </>
  )
  }
}
