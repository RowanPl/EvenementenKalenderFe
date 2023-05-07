import axios from "axios";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Main() {
    const [events, setEvents] = useState([]);
    const Navigate = useNavigate()


    useEffect(() => {
        fetchData()

    }, []);

    function fetchData() {
        try {
            axios.get(`http://localhost:8080/events`)
                .then((result) => {
                    setEvents(result.data);

                });
        } catch (e) {
            console.error(e);
        }
    }

    const handleImageClick = (event) => {
        const eventUrl = `/events/${event.id}`;
        Navigate(eventUrl);
    }
    return (
        <div className="background_container">
            <h1>Aankomende evenementen:</h1>
            <div className="program_container">

                {events
                    .filter(event => new Date(event.dates[0]) >= new Date())
                    .map(event => (
                        <div className="event_layout" key={event.id}>
                            <img
                                key={event.id}
                                alt={`${event.eventCreator} - ${event.nameOfEvent}`}
                                src={event.file?.url || `https://via.placeholder.com/150?text=${event.eventCreator}`}
                                onClick={() => handleImageClick(event)}
                            />
                            <p className="title">{event.nameOfEvent}</p>
                            <p>Categorie: {event.eventType}</p>
                            <p>Datum: {event.dates.join(', ').replace(/,/g, ' , ')}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Main;
