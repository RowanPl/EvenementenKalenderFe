import {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import "./SignUp.css"

function SignUp() {
    // state voor het formulier
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [creator, setCreator] = useState(false);
    // state voor functionaliteit
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(creator);
        toggleError(false);
        toggleLoading(true);

        try {
            await axios.post('http://localhost:8080/users', {
                email: email,
                password: password,
                username: username,
                enabled: true,
                creator: creator,
            });

            // Let op: omdat we geen axios Canceltoken gebruiken zul je hier een memory-leak melding krijgen.
            // Om te zien hoe je een canceltoken implementeerd kun je de bonus-branch bekijken!

            // als alles goed gegaan is, linken we door naar de login-pagina
            navigate('/signin');
        } catch (e) {
            console.error(e);
            toggleError(true);
        }

        toggleLoading(false);
    }


    return (
        <>
            <div className="signup_bar"></div>
            <div className="signup_background_container">
                <h1>Registreren</h1>
                <div className="signup_form_container">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="isCreator">
                            Ben je een cultuur aanbieder?
                            <input
                                type="checkbox"
                                id="isCreator"
                                name="isCreator"
                                checked={creator}
                                onChange={(e) => setCreator(e.target.checked)}
                            />
                        </label>
                        {creator === false && <label htmlFor="username-field">
                            Gebruikersnaam:
                            <input
                                type="text"
                                id="username-field"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>}
                        {creator === true && <label htmlFor="username-field">
                            Naam van de organisatie:
                            <input
                                type="text"
                                id="username-field"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>}

                        <label htmlFor="email-field">
                            Emailadres:
                            <input
                                type="email"
                                id="email-field"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <label htmlFor="password-field">
                            Wachtwoord:
                            <input
                                type="password"
                                id="password-field"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        {creator === false && <label htmlFor="newsletter-field">
                            Ik ontvang graag maandelijks informatie over evenementen.
                            <input
                                type="checkbox"
                                id="newsletter-field"
                                name="newsletter"
                            />
                        </label>}
                        {error && <p className="error">{error}</p>}
                        <button
                            type="submit"
                            className="form_button"
                            disabled={loading}
                        >
                            Registreren
                        </button>
                    </form>
                </div>
                <div className="sign_up_account">
                    <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p></div>
            </div>
            <div className="signup_bar"></div>
        </>
    );
}


export default SignUp;