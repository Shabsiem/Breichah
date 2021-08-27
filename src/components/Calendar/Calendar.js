import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import './calendar.css'
import BookingSideBar from './Booking'
import firebase from '../../firebase'

export default function Calendar() {

  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [yearSchedule, setYearSchedule] = useState([])
  const [show, setShow] = useState(false)
  const [selectedDate, setSelectedDate] = useState([])

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
    firebase.database().ref().child('schedule/').get().then((snapshot)=>{
      setYearSchedule(snapshot.val())
      setLoading(false)
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

  function handleShow(event){
    let date = event.target.id
    setSelectedDate(yearSchedule[selectedMonth+1][date-1])
    setShow(!show)
  }

function RenderSchedule(date){
  let timeSchedule = []
  for (var x = 0; x < date.date.timesTable.length; x++){
    let specifics = date.date.timesTable[x]
    const message = `${specifics.stime || 'ALL'}-${specifics.etime || 'DAY'} ${specifics.purpose}`
    timeSchedule.push(
      <li style={{ backgroundColor: 
        specifics.reservable ? 'green': 
          specifics.purpose === 'Rental' ? 'red' : 
          specifics.purpose === 'Women' ? 'pink' : 'blue'}} key={`time ${x}`}>{message}</li>
    )
  }
  return timeSchedule
}

  function RenderDays(){
    const today = new Date().getDate()
    let currentMonthDays = []
    if (selectedMonth > 4 && selectedMonth < 8){
    for(let x = firstDayIndex; x>0; x--){
      currentMonthDays.push(<div className='prev-date' onClick={handleNav} key={`lastMonth ${x}`} > {prevLastDay - x +1} </div>)
    }
    for (let q = 0; q < yearSchedule[selectedMonth+1].length; q++){
      currentMonthDays.push(
          <OverlayTrigger
           placement='top'
           overlay={
             <Tooltip id={'tooltip-top'} >
             <ul>
              <RenderSchedule
              date= {yearSchedule[selectedMonth+1][q]}/>
             </ul>
           </Tooltip>}
            key={`thisMonth ${q}`}
            >
              <div className= {q === today ? 'today': 'null'} onClick={(e)=>{handleShow(e)}} id={q+1}>{q+1} </div>
            </OverlayTrigger>
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
    console.log(e)
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
  if (loading){
    return(
      <div>Loading...</div>
    )
  }else{
  return (
  <>
    <div className="container-xl">
      {show? < BookingSideBar
        handleShow = {handleShow}
        details = {selectedDate}
        />: null} 
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
          <div>Sat</div>
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
