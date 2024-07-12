import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../css/AllEvents.css';


const AllEvents = ({base_url}) => {

    const [allEvents, setAllEvents] = useState([]);
    const [savedEventsIds, setSavedEventsIds] = useState([]);

    useEffect(() => {
      fetchEvents();
    }, []);

    const fetchEvents = async () => {

      const response = await axios.get(
        base_url + "/getAllEvents",
        { params :  {}  }
      );
      setAllEvents(response.data.data)
    }

    const saveEvent = async (eventId) => {
        if (!savedEventsIds.includes(eventId)) {
          setSavedEventsIds([...savedEventsIds, eventId]);
        }
      };

    const deleteEvent = async (id) => {
      const response = await axios.get(
        base_url + "/deleteEvent",
        { params :  {
          "eventId": id
        }  }
      );
      fetchEvents();
      alert(response.data.message);
    }

  return (
    <div className='container'>
      <div className='section'>
          <h2>All Events</h2>
          <div className="events-list">
          {allEvents.map((event) => (
              <div key={event.eventId} className="event">
                  <h3>{event.eventName}</h3>
                  <p>Location: {event.location}</p>
                  <p>Date: {event.eventDate}</p>
                  <p>Organizer: {event.organizer}</p>
                  <button onClick={() => saveEvent(event.eventId)} className="save-btn">Save</button>
                  <button onClick={() => deleteEvent(event.eventId)} className="delete-btn">Delete</button>
              </div>
          ))}
          </div>
        </div>
        <div className='section'>
          <h2>Saved Events</h2>
          <div className='events-list'>
            {allEvents.filter(event => savedEventsIds.includes(event.eventId)).map((event) => (
              <div key={event.eventId} className="event">
                  <h3>{event.eventName}</h3>
                  <p>Location: {event.location}</p>
                  <p>Date: {event.eventDate}</p>
                  <p>Organizer: {event.organizer}</p>
                  <button onClick={() => setSavedEventsIds(savedEventsIds.filter((item)=> item !== event.eventId ))} className="delete-btn">Remove</button>
              </div>
          ))}
          </div>
        </div>
    </div>
    
  )
}

export default AllEvents
