import React, {useState} from 'react';
import axios from 'axios';
import '../css/CreateEvent.css';
const CreateEvent = ({base_url}) => {

    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        location: '',
        organizer: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const publishEvent = async () => {
        const response = await axios.get(
            base_url + "/publish",
            { params :  {
                "message": "This is your email confirmation for creating an event",
                "subject": "Event created confirmed"
            }  }
          )
    }
    const createEvent = async (event) => {
    
        event.preventDefault();
        
        const response = await axios.get(
          base_url + "/createEvent",
          { params :  {
            "eventId" : Math.floor(Math.random() * (1000)).toString(),
            "eventName" : formData.eventName,
            "eventDate": formData.eventDate,
            "location": formData.location,
            "organizer": formData.organizer
          }  }
        );

        alert(response.data.message);
        setFormData({
          eventName: '',
          eventDate: '',
          location: '',
          organizer: ''
      })
      publishEvent();

    }
  return (
    <form className="event-form" onSubmit={createEvent}>
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

        <button type="submit" className="create-btn">Create</button>
    </form>
  )
}

export default CreateEvent
