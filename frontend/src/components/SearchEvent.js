import React, {useState} from 'react';
import axios from 'axios';
import '../css/SearchEvent.css'

const SearchEvent = ({base_url}) => {

    const [eventId, setEventId] = useState('');
    const [eventData, setEventData] = useState({});
    const [searching, setSearching] = useState(false);

    const searchEvent = async (e) => {
        setSearching(true);
        const response = await axios.get(
          base_url + "/getEvents",
          { params :  {
            "eventId" : eventId,
          }  }
        );
        console.log(response.data.data);
        setEventData(response.data.data)
          setSearching(false);
      }
  return (
    <div className="search-container">
        <div className="search-form">
            <input
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Enter event ID"
                required
            />
            <button onClick={searchEvent} type="submit" disabled={searching}>Search</button>
        </div>
        {Object.keys(eventData).length!==0 && (
            <div className="event-data">
                <h2>{eventData.eventName}</h2>
                <p>Location: {eventData.location}</p>
                <p>Date: {eventData.eventDate}</p>
                <p>Organizer: {eventData.organizer}</p>
            </div>
        )}
    </div>
  )
}

export default SearchEvent
