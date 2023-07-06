/* eslint-disable */
import React, {useContext, useEffect, useState} from "react";
import "./Calender.css"
import axios from "axios";
import {AuthContext} from "../Context/AuthContext";
import Event from "../Pages/CreateEvent";
import {useNavigate} from "react-router-dom";

function Calender({category}) {

    const currentDate = new Date();
    const {hasAuth} = useContext(AuthContext);
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth());
    const [events, setEvents] = useState([]);
    const [selectedDate] = useState(new Date());
    const {token} = useContext(AuthContext);
    const [event] = useState(null);
    const [show] = useState(false);
    const Navigate = useNavigate()


    async function getEvents(token, category = null) {
        try {
            let url = `http://${hasAuth.ip}/events`;
            if (category) {
                url += `/category/${category}`;
            }
            const result = await axios.get(url);
            setEvents(result.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getEvents(token, category);
    }, [month, year]);

    function now() {
        setMonth(currentDate.getMonth());
        setYear(currentDate.getFullYear());
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({length: daysInMonth}, (_, i) => new Date(year, month, i + 1));
    const monthName = daysArray[0].toLocaleString('nl-NL', {month: 'long'});


    const handlePrev = () => {
        setMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setYear((prevYear) => (month === 0 ? prevYear - 1 : prevYear));
    };

    const handleNext = () => {
        setMonth((nextMonth) => (nextMonth === 11 ? 0 : nextMonth + 1));
        setYear((nextYear) => (month === 11 ? nextYear + 1 : nextYear));
    };


    daysArray.map(day => {
        // Filter events that occur on this day
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day.getDate();
        });
    })


    const handleImageClick = (event) => {
        const eventUrl = `/events/${event.id}`;
        Navigate(eventUrl);
    }


    return (
        <>
            <p className="month_year">{monthName} {year}</p>
            <div className="calender_button">
                <button onClick={handlePrev}>Prev</button>
                {month !== new Date().getMonth() && (
                    <button onClick={now}>Deze maand</button>
                )}
                <button onClick={handleNext}>Next</button>
            </div>
            <div className="calender" key={`${month}-${year}-${events.length}`}>


                {daysArray.map(day => {
                    // Filter events that occur on this day
                    const dayEvents = events.filter(event => {
                        const eventDates = event.dates.map(date => new Date(date));
                        return eventDates.some(eventDate => eventDate.getFullYear() === year && eventDate.getMonth() === month && eventDate.getDate() === day.getDate());
                    });
                    const isSelectedDate = selectedDate && day.toDateString() === selectedDate.toDateString();
                    const className = `day_calender_container ${isSelectedDate ? 'today' : ''}`;


                    return (
                        <div className="calendar-day" key={day.getTime()}>
                            <div className={className}>
                                <p className="day">{day.toLocaleDateString('nl-NL', {weekday: 'short'})}</p>
                                <p className="day">{day.getDate()}</p>
                                <div className="events-container">
                                    {dayEvents.map((event) => (
                                        <img
                                            key={event.id}
                                            alt={`${event.eventCreator} - ${event.title}`}
                                            src={event.file?.url || `https://via.placeholder.com/150?text=${event.eventCreator}`}
                                            onClick={() => handleImageClick(event)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {show && <Event id={event.id}/>}
        </>
    );
}

export default Calender;