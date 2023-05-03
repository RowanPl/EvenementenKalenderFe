import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import axios from "axios";
import {AuthContext} from "../Context/AuthContext";
import "./SignIn.css"


function SignIn({children}) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, toggleError] = useState(false);
    const {login} = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();
        toggleError(false);

        try {
            const result = await axios.post('http://localhost:8080/authenticate', {
                username: username,
                password: password,
            });
            console.log(result.data);

            login(result.data.jwt);

        } catch (e) {
            console.error(e);
            toggleError(true);
        }
    }

    return (
        <>
            {children}
            <div className="sign_in_bar"></div>
            <div className="sign_in_container">
                <h1>Inloggen</h1>
                <div className="sign_in_form_container">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username-field">
                            Gebruikersnaam:
                            <input
                                type="username"
                                id="username-field"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                        {error && <p className="error">Combinatie van gebruikersnaam en wachtwoord is onjuist</p>}

                        <button
                            type="submit"
                            className="form-button"
                        >
                            Inloggen
                        </button>
                    </form>
                </div>
                <div className="sign_in_account">
                    <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
                </div>
            </div>

        </>
    );
}

export default SignIn;