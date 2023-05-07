import React, {useEffect} from 'react';

import '../Components/Calender.css';
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import axios from "axios";
import "./CreateEvent.css"
import {useNavigate} from "react-router-dom";


function CreateEvent() {

    const [dates, setDates] = React.useState([]);
    const [Image, setImage] = React.useState({})
    const [nameOfEvent, setNameOfEvent] = React.useState("")
    const [moreInformation, setMoreInformation] = React.useState("")
    const [location, setLocation] = React.useState("")
    const [linkToEvent, setLinkToEvent] = React.useState("")
    const [time, setTime] = React.useState("")
    const [category, setCategory] = React.useState("Theater")
    const [imageUrl, setImageUrl] = React.useState("")
    const Navigate = useNavigate()


    async function handlePostRequest() {
        const token = localStorage.getItem("token")
        console.log(token);
        try {
            const result = await axios.post('http://localhost:8080/events', {
                nameOfEvent: nameOfEvent,
                moreInformation: moreInformation,
                location: location,
                linkToEvent: linkToEvent,
                time: time,
                eventType: category,
                dates: dates.map(date => date.year + "-" + (date.months[date.monthIndex].index + 1).toString().padStart(2, "0") + "-" + date.day.toString().padStart(2, "0"))
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }

            }).then(async (respone) => {
                console.log(respone)
                const id = respone.data
                console.log(id)
                const imgUpload = await axios.post(`http://localhost:8080/events/${id}/upload?=`, {
                    file: Image
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                })
            }, (error) => {
                console.log(error)
            })
        } catch (e) {
            console.error(e);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(dates.map(date => date.year + "-" + (date.months[date.monthIndex].index + 1).toString().padStart(2, "0") + "-" + date.day))
        void handlePostRequest()
        switch (category) {
            case "Theater":
                Navigate(`/Theater`)
                break;
            case "Muziek":
                Navigate(`/Muziek`)
                break;
            case "Dance":
                Navigate(`/Dans`)
                break;
        }
        setDates([])
    }

    function handleDateSelect(date) {

        setDates(prevDates => [...prevDates, date.dateClicked]);
    }

    return (
        <div className="create_event_container">
            <div className="create_event_content">
                <h2>Create Event</h2>
                <div className="create_event_form">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="nameOfEvent">Naam van het event</label>
                        <input type="text" id="nameOfEvent" name="nameOfEvent" placeholder="Name of Event"
                               onChange={(e) => setNameOfEvent(e.target.value)} required/>

                        <label htmlFor="moreInformation">Informatie voor de lezer</label>
                        <input type="text" id="moreInformation" name="moreInformation" placeholder="More Information"
                               onChange={(e) => setMoreInformation(e.target.value)} required/>

                        <label htmlFor="location">Locatie</label>
                        <input type="text" id="location" name="location" placeholder="Location"
                               onChange={(e) => setLocation(e.target.value)} required/>

                        <label htmlFor="date">Datum</label>
                        <DatePicker
                            multiple
                            onFocusedDateChange={(dateFocused, dateClicked) => {
                                handleDateSelect({dateFocused, dateClicked});
                            }}
                            plugins={[<DatePanel markFocused/>]}
                        />

                        <label htmlFor="time">Start tijd</label>
                        <input type="time" id="time" name="time" placeholder="Time"
                               onChange={(e) => setTime(e.target.value)} required/>

                        <label htmlFor="linkToEvent">Link naar het Event</label>
                        <input type="text" id="linkToEvent" name="linkToEvent"
                               onChange={(e) => setLinkToEvent(e.target.value)} placeholder="Link to Event" required/>

                        <label htmlFor="category">Categorie</label>
                        <select type="radio" id="category" name="category" onChange={(e) => setCategory(e.target.value)}
                                placeholder="Category" required>
                            <option value="Theater">Theater</option>
                            <option value="Music">Muziek</option>
                            <option value="Dance">Dans</option>
                        </select>

                        <p>Afbeelding wordt op 300x200 geladen</p>
                        <label htmlFor="file">Affiche</label>
                        <input type="file" id="file" name="file" onChange={(e) => {
                            const file = e.target.files[0];
                            setImageUrl(URL.createObjectURL(file));
                            setImage(e.target.files[0]);
                        }} placeholder="File" required/>

                        <button type="submit" value="Submit">Aanmaken</button>
                    </form>
                </div>
            </div>
            <div>
                {/* eslint-disable-next-line no-mixed-operators */}
                {nameOfEvent && (
                    <div className="preview_container">
                        <h2>Preview</h2>
                        <div className="preview">
                            <div className="event">
                                <h2>{nameOfEvent}</h2>
                                <p>Meer informatie: {moreInformation}</p>
                                <p>Locatie: {location}</p>
                                <p>Datum: {dates.map(date => date.day + " " + date.months[date.monthIndex].name + " " + date.year + ",")}</p>
                                <p>Tijd: {time}</p>
                                <p>Link naar het event: www.{linkToEvent}</p>
                                <p>Categorie: {category}</p>

                                <img src={imageUrl} alt={nameOfEvent}/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );

}

export default CreateEvent;
