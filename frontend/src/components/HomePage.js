import React, { useState, useEffect } from 'react'
import "./style.css"

const HomePage = () => {

  let base_url = 'https://jigunuk7xk.execute-api.us-east-1.amazonaws.com/dev';
  const [allEvents, setAllEvents] = useState([]);
  const [savedEventsIds, setSavedEventsIds] = useState([]);
  
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  
  const [searchID, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({})
    };
  
    fetch(base_url+'/getAllEvents', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setAllEvents(data.data);
        } else {
          console.error('Expected an array in the response data:', data);
          setAllEvents([]);
        }
      })
      .catch(error => {
        console.error("Failed to load events:", error);
        setAllEvents([]);
      });
  }
  const saveEvent = (eventId) => {
    // if (!savedEvents.some(savedEvent => savedEvent.id === event.id)) {
      if (!savedEventsIds.includes(eventId)) {
        setSavedEventsIds([...savedEventsIds, eventId]);
      }
    //   fetch('https://api.example.com/save-event', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(event),
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Success:', data);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
    // }
  };

  const createEvent = (event) => {
    
    event.preventDefault();
    const eventBody = {
      method: 'POST',
      headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     },
      body: JSON.stringify({
      "eventId": Math.floor(Math.random() * (1000)).toString(),
      "eventName": eventName,
      "eventDate": date,
      "location": location,
      "organizer": organizer,
      "userId":"1"
      })  
    }

    fetch(base_url+'/createEvent', eventBody)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        alert(JSON.stringify(data.message));
        setEventName('');
        setDate('');
        setLocation('');
        setOrganizer('');
        fetchEvents();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to create event. Please try again.');
      });
  }
  
  const deleteEvent = (id) => {
    const reqbody = {
      method: 'POST',
      headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     },
      body: JSON.stringify({ "eventId": id})  
    }

    fetch(base_url+'/deleteEvent', reqbody)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        alert(JSON.stringify(data.message));
        fetchEvents();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to create event. Please try again.');
      });
  }
  const searchEvent = (id) => {
    // setSearchId(id);
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({"eventId": searchID})
    };

    fetch(base_url+'/getEvents', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setSearchResults(data.data);
        } else {
          console.error('Expected an array in the response data:', data);
          setSearchResults({});
        }
      })
      .catch(error => {
        console.error("Failed to load events:", error);
        setAllEvents([]);
      });
  }
  
  return (
    <>
    <div className="events-container">
      <div className='form'>
        <h2>Create Event</h2>
        <form onSubmit={createEvent}>
          <input type="text" placeholder="Enter event name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
          <input type="text" placeholder="Enter event date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <input type="text" placeholder="Enter organizer" value={organizer} onChange={(e) => setOrganizer(e.target.value)} required />
          <div className='create-button'>
          <button type='submit'>Create<div className='hub'>event</div></button>
          </div>
        </form>
      </div>
      <div className="event-section">
        <h2>All Events</h2>
        <ul className="event-list">
          {allEvents.map(event => (
            <li key={event.eventId} className="event-item">
              <div className='event-details'>
                <b>{event.eventName}</b><br/>
                <>{event.organizer} &nbsp;- {event.location}</><br/>
                <>Date : {event.eventDate}</>
              </div>
              <div className='buttons'>
                <button onClick={() => saveEvent(event.eventId)} className="save-button" disabled={savedEventsIds.includes(event.eventId)}>Save</button>
                <button onClick={() => deleteEvent(event.eventId)} className="delete-button">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="event-section">
        <h2>Saved Events</h2>
        <ul className="event-list">
            {allEvents.filter(event => savedEventsIds.includes(event.eventId)).map(event => (
              <li key={event.eventId} className="event-item">
                <div className='event-details'>
                  <b>{event.eventName}</b><br/>
                  <>{event.organizer} &nbsp;- {event.location}</><br/>
                  <>Date : {event.eventDate}</>
                </div>
                {/* {!savedEventsIds.includes(event.eventId) ?
                <button onClick={() => saveEvent(event.eventId)} className="save-button" disabled={savedEventsIds.includes(event.eventId)}>Save</button>
                : <div>Saved</div>} */}
              </li>
            ))}
        </ul>
      </div>
    </div>
    <div className="events-container">
      <div className='form'>
          <h2>Search Event</h2>
          <input type="text" placeholder="Search by event id" value={searchID} onChange={(e) => setSearchId(e.target.value)} required />
          <button onClick={(e) => searchEvent(searchID)}>Done</button>
          {Object.keys(searchResults).length !==0 ?
              <div className='event-details'>
                <b>{searchResults.eventName}</b><br/>
                <>{searchResults.organizer} &nbsp;- {searchResults.location}</><br/>
                <>Date : {searchResults.eventDate}</>
              </div>
              : 
               <div>No events found</div>
          }
        </div>
        
    </div>
    </>
  )
}

export default HomePage