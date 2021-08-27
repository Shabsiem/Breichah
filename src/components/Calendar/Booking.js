
import React from 'react'
import { Table, Form } from 'react-bootstrap'
import './calendar.css'

export default function BookingSideBar(props) {
  const Schedule = ()=>{
    const ph = props.details.timesTable
    let times = []
    for (var x = 0; x< ph.length; x++){
      ph[x].reservable ? 
      times.push(
        <tr>
          <td>{ph[x].stime}- {ph[x].etime}</td>
          <td style={{backgroundColor: 'aquamarine'}}>Reserve Now</td>
        </tr>
      )
      :
      times.push(
        <tr>
          <td>{ph[x].stime || 'ALL'}- {ph[x].etime || "DAY"}</td>
          <td>{ph[x].purpose}</td>
        </tr>
      )
    }
    return times
  }
  return(
    <div className = 'sideBar' style = {{
      height: '100%',
      width: '30%',
      position: 'fixed',
      zIndex: '1',
      top: '0',
      left: '70%',
      backgroundColor: 'blue',
      overflowX: 'hidden',
      paddingTop: '60px',
      transition: '0.5s', 
    }}>
      <button className='closebtn' onClick={props.handleShow}>&times;</button>
      <Table striped bordered hover>
        {/* <RenderSchedule/> */}
        <thead>
          <tr>
            <th>Time</th>
            <th onClick={Schedule}>Schedule</th>
          </tr>
        </thead>
        <tbody>
          <Schedule/>
        </tbody>
      </Table>
      <Form>

      </Form>
    </div>
  )
}