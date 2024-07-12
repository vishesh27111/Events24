import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../css/Update.css';
import '../css/AllEvents.css';

const Update = ({base_url}) => {

    const [allEvents, setAllEvents] = useState([]);
    const [update, setUpdate] = useState(false)
    const [formData, setFormData] = useState({
        eventId : '',
        eventName: '',
        eventDate: '',
        location: '',
        organizer: '',
        userId: '1'
    });

    useEffect(() => {
        fetchEvents();
        console.log(formData)
      }, []);

    const fetchEvents = async () => {

        const response = await axios.get(
            base_url + "/getAllEvents",
            { params :  {}  }
        );
        setAllEvents(response.data.data)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("hc:",formData)
    };
    
    const editEvent = (event) => {
        setUpdate(true);
        setFormData(event);
        console.log("ev:",formData);
    }

    const updateEvent = async (event) => {
        console.log("ue:",formData);
        const response = await axios.get(
            base_url + "/updateEvent",
            { params :  formData }
        );

        alert(response.data.message);
        setUpdate(false);
        // setFormData({
        //     eventId : '',
        //     eventName: '',
        //     eventDate: '',
        //     location: '',
        //     organizer: '',
        //     userId: '1'
        // })
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
                  <button onClick={() => editEvent(event)} className="save-btn">Update</button>
              </div>
          ))}
          </div>
      </div>
        <div className='section'>
        {update &&
        <>
            <h2>Update Event</h2>
            <form className="event-form" onSubmit={updateEvent}>
                <div className="form-field">
                    <label htmlFor="eventName">Event Name</label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="eventDate">Event Date</label>
                    <input
                        type="text"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="organizer">Organizer</label>
                    <input
                        type="text"
                        id="organizer"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='btn'>
                    <button type="submit" className="save-btn">Update</button>
                    <button onClick={() => setUpdate(false)} className="delete-btn">Cancel</button>
                </div>
            </form> 
            </>   
        }  
        </div>
    </div>
  )
}

export default Update
