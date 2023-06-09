/* eslint-disable */
import axios from "axios";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../Context/AuthContext";
import {Link} from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import "./profile.css";

function Profile() {
    const {hasAuth} = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [textError, setError] = useState(null);
    const [error, toggleError] = useState(true);
    const [username, setUsername] = useState(hasAuth.user.username);
    const [email, setEmail] = useState("");
    const [creator, setCreator] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [password, setPassword] = useState("");
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const [filteredEvents, setFilteredEvents] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            void fetchProfileData(token);
        }
    }, []);

    useEffect(() => {
        const SentEmail = hasAuth.user.shouldSentEmail
        if (SentEmail) {
            handleGetEvents()
            hasAuth.user.emailSent = true
        }
    }, [hasAuth.user.shouldSentEmail]);

    function fetchProfileData(token) {
        fetchData()

        async function fetchData() {
            const source = axios.CancelToken.source();
            try {
                const result = await axios.get(`http://${hasAuth.ip}/users/${username}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    cancelToken: source.token,
                });
                setProfileData(result.data);
                setUsername(result.data.username);
                setEmail(result.data.email);
                setCreator(result.data.creator);
                setNewsletter(result.data.newsletter);


                console.log(result.data)
            } catch (e) {
                console.error(e);

            }
            return function cleanup() {
                source.cancel();
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:8080/users/${username}`,
                {
                    username: username,
                    email: email,
                    creator: creator,
                    newsletter: newsletter,
                    password: password,
                    enabled: true,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            void fetchProfileData(token);
        } catch (e) {
            console.error(e);
            setError(e.response.data)
            toggleError(true)
        }
    }

    async function handleGetEvents() {
        setFilteredEvents([])

        await axios.get("http://localhost:8080/events")

            .then(response => {
                const result = response.data;
                result.filter(event => {
                    const eventDates = event.dates.map(dateStr => new Date(dateStr));
                    const eventDatesWithinRange = eventDates.filter(date => date >= today && date < nextMonth);
                    if (eventDatesWithinRange.length > 0) {
                        setFilteredEvents(prevState => [...prevState, event]);
                    }
                });

                const emailBody = (
                    <body>
                        <h2>Evenementen van deze maand</h2>
                        <ul>
                            {filteredEvents.map(event => (
                                <li key={event.id}>
                                    <h3>{event.nameOfEvent}</h3>
                                    <img
                                        src='http://localhost:8080/download/Obelix1.png'
                                        alt={event.nameOfEvent} style={{width: '100px', height: '200px'}}/>
                                    <p>Datum: {event.dates.join(', ').replace(/,/g, ' , ')}</p>
                                    <p>Locatie: {event.location}</p>
                                    <a href={event.linkToEvent}>Meer informatie</a>
                                </li>
                            ))}
                        </ul>
                    </body>
                );
                const emailHTML = ReactDOMServer.renderToString(emailBody);
                console.log(emailHTML)
                async function SendEmail() {
                    const token = localStorage.getItem("token");
                    sendEmailRequest()

                    function sendEmailRequest() {
                        axios.post("http://localhost:8080/events/sendEmail", {
                            toEmail: email,
                            subject: "Evenementen van deze maand",
                            text: emailHTML,
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            }
                        })
                            .then(response => {
                                console.log("Email sent", response.data);
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                }

                SendEmail();
            }).catch(error => {
                console.error(error);
            })
    }

    return (
        <div className="profile_display">
            <div className="profile_container">
                <div className="profile_content">
                    <h1>Profielpagina</h1>
                    <div className="profile_form">
                        {error && <p className="error"> {textError}</p>}
                        <form onSubmit={handleSubmit}>
                            {profileData && profileData.creator && (<>
                                    <label htmlFor="username">Naam van de organisatie:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        readOnly
                                    />
                                </>
                            )}
                            {profileData && !profileData.creator && (<>

                                    <label htmlFor="username">Gebruikersnaam:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                    />
                                </>
                            )}
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <label htmlFor="password">Wachtwoord</label>
                            <input
                                type="password"
                                id="password"
                                name="password"

                                value={password}
                                placeholder="Laat deze leeg om hem niet te veranderen"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <label htmlFor="newsletter">Nieuwsbrief</label>
                            <input
                                type="checkbox"
                                id="newsletter"
                                name="newsletter"
                                checked={newsletter}
                                onChange={(e) => setNewsletter(e.target.checked)}
                            />
                            <label htmlFor="creator">Creator</label>
                            <input
                                type="checkbox"
                                id="creator"
                                name="creator"
                                checked={creator}
                                onChange={(e) => setCreator(e.target.checked)}
                            />

                            <button type="submit">Update</button>

                        </form>
                    </div>

                    {/*deze functie is er alleen om een nieuwsbrief te verzenden naar het desbetreffende email adres, normaal zou dit automatisch verzonden worden*/}
                    {newsletter &&
                        <button className="profile_button" onClick={() => handleGetEvents()}> Test Nieuwsbrief</button>}

                    <p className="text">Terug naar de <Link to="/">Homepagina</Link></p>
                </div>
            </div>
        </div>
    );

}

export default Profile;
