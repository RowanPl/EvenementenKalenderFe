import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";
import './EventPage.css';
import {AuthContext} from "../Context/AuthContext";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

function EventPage() {

    const [event, setEvent] = useState(null);
    const [user, setUser] = useState(null);
    const {hasAuth} = useContext(AuthContext);
    const [canDeleteEvent, setdeleteEvent] = useState(false);
    const [canEditEvent, setEditEvent] = useState(false);
    const [file, setFile] = useState(null);
    // get the event id from the URL parameter
    const {id} = useParams();
    const [dates, setDates] = React.useState([]);
    const [Image, setImage] = React.useState({})
    const [nameOfEvent, setNameOfEvent] = React.useState("")
    const [moreInformation, setMoreInformation] = React.useState("")
    const [location, setLocation] = React.useState("")
    const [linkToEvent, setLinkToEvent] = React.useState("")
    const [time, setTime] = React.useState("")
    const [category, setCategory] = React.useState("Theater")
    const [imageUrl, setImageUrl] = React.useState("")
    const [eventCreator, setEventCreator] = React.useState("")


    useEffect(() => {
        fetchData(id)
        setUser(hasAuth.user.username)
    }, []);

    function fetchData(eventId) {
        try {
            axios.get(`http://localhost:8080/events/${eventId}`)
                .then((result) => {
                    setEvent(result.data);
                    console.log(result.data)
                    setNameOfEvent(result.data.nameOfEvent)
                    setMoreInformation(result.data.moreInformation)
                    setLocation(result.data.location)
                    setLinkToEvent(result.data.linkToEvent)
                    setTime(result.data.time)
                    setCategory(result.data.eventType)
                    setDates(result.data.dates)
                    setFile(result.data.file)
                    setEventCreator(result.data.eventCreator)

                });
        } catch (e) {
            console.error(e);
        }
    }

    if (!event) {
        return <div>Loading...</div>;
    }

    function handleDeleteEvent() {
        const token = localStorage.getItem('token');
        if (token) {
            void deleteEvent(token);
        }
    }

    async function deleteEvent(token) {
        try {
            const result = await axios.delete(`http://localhost:8080/events/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(result.data)
        } catch (e) {
            console.error(e);
        }
    }

    function handleEditEvent() {
        setEditEvent(true);
        setdeleteEvent(true);
    }

    async function editEvent(token) {
        try {
            const result = await axios.put(`http://localhost:8080/events/${id}`, {

                    id: id,
                    nameOfEvent: nameOfEvent,
                    eventType: category,
                    moreInformation: moreInformation,
                    location: location,
                    dates: dates,
                    time: time,
                    linkToEvent: linkToEvent,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                });
            console.log(result.data)
            console.log(file.fileName)
            console.log(Image)
            console.log(event.fileUpload)

            if (event.file === null || Image.Name !== event.fileUpload.fileName) {
                uploadImage(token)
            }

            async function uploadImage(token) {
                console.log(id)
                const imgUpload = await axios.post(`http://localhost:8080/events/${id}/upload?=`, {
                    file: Image || event.file,
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                })
            }

            console.log("Check")


        } catch (e) {
            console.error(e);
        }
    }


    function handleSubmit(e) {
        e.preventDefault()
        setDates([])
        const token = localStorage.getItem('token');
        void editEvent(token).then(() => {
                console.log("Event edited")
            }
        )
    }

    function handleDateSelect(date) {
        setDates((prevDates) => [...prevDates, date.dateClicked]);
    }

    function removeDates(e) {
        e.preventDefault();
        console.log(event.file)
        setDates([]);
    }


    return (
        <div className="event_container">
            <div className="event">
                {event &&
                    <div className="event_content">
                        <img src={event.file?.url || `https://via.placeholder.com/150?text=${eventCreator}`}
                             alt={`${eventCreator} - ${nameOfEvent}`}/>
                        <h2>{nameOfEvent}</h2>
                        <p>{eventCreator}</p>
                        <p>Omschrijving: {moreInformation}</p>
                        <p>Locatie: {location}</p>
                        <p>Datum: {dates.join(', ').replace(/,/g, ' , ')}</p>
                        <p>Start tijd: {time}</p>
                        <p>Categorie: {category}</p>

                        <p><a href={`https://${linkToEvent}`}>Klik hier voor meer informatie</a></p>
                    </div>
                }


                {event && user === event.eventCreator && (
                    <div className="event_button">
                        {canDeleteEvent && <button onClick={handleDeleteEvent}>Delete</button>}
                        <button onClick={handleEditEvent}>Edit</button>
                    </div>


                )}
            </div>
            {canEditEvent && (
                <div className="form_container">
                    <div className="form_content">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="nameOfEvent">Naam van het event</label>
                        <input type="text" id="nameOfEvent" name="nameOfEvent" placeholder="Name of Event"
                               value={nameOfEvent}
                               onChange={(e) => setNameOfEvent(e.target.value)} required/>

                        <label htmlFor="moreInformation">Informatie voor de lezer</label>

                        <input type="text" id="moreInformation" name="moreInformation" placeholder="More Information"
                               value={moreInformation}
                               onChange={(e) => setMoreInformation(e.target.value)} required/>

                        <label htmlFor="location">Locatie</label>
                        <input type="text" id="location" name="location" placeholder="Location"
                               value={location}
                               onChange={(e) => setLocation(e.target.value)} required/>


                        <label htmlFor="date">Datum</label>
                        <DatePicker
                            multiple
                            value={dates}
                            onFocusedDateChange={(dateFocused, dateClicked) => {
                                handleDateSelect({dateFocused, dateClicked});
                            }}
                            plugins={[<DatePanel markFocused/>]}
                        />
                        <button type="button" onClick={removeDates}>verwijder datums</button>

                        <label htmlFor="time">Start tijd</label>
                        <input type="time" id="time" name="time" placeholder="Time"
                               value={time}
                               onChange={(e) => setTime(e.target.value)} required/>

                        <label htmlFor="linkToEvent">Link naar het Event</label>
                        <input type="text" id="linkToEvent" name="linkToEvent"
                               value={linkToEvent}
                               onChange={(e) => setLinkToEvent(e.target.value)} placeholder="Link to Event" required/>

                        <label htmlFor="category">Categorie</label>
                        <select type="radio" id="category" name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Category" required>
                            <option value="Theater">Theater</option>
                            <option value="Music">Muziek</option>
                            <option value="Dance">Dans</option>
                        </select>


                        <label htmlFor="file">Affiche*</label>
                        <input type="file" id="file" name="file" onChange={(e) => {
                            setFile(e.target.files[0]);
                            const fileImg = e.target.files[0];
                            console.log(e.target.files);
                            setImageUrl(URL.createObjectURL(fileImg));
                            setImage(e.target.files[0]);
                        }} placeholder="File" required/>

                        <p>velden met een "*" zijn verplichte velden</p>
                        <button type="submit"> Pas aan</button>
                    </form>
                </div>
                </div>
            )}

        </div>
    );
};

export default EventPage;
