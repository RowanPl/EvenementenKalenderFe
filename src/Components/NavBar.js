import React, {useContext} from 'react';
import {Link, NavLink} from 'react-router-dom';
import './NavBar.css';
import {AuthContext} from "../Context/AuthContext";

function NavBar() {
    const {hasAuth, logout} = useContext(AuthContext);

    console.log(hasAuth)

    return (
        <div className="NavBar">
            <Link to="/">
                <h3>
                    Evenementen
                    Kalender
                </h3>
            </Link>


            <nav>
                { hasAuth.hasAuth === false && <ul className="NavUser">
                    <li>
                        <NavLink to="/signIn">Login</NavLink>
                    </li>
                    <li className="nav_register">
                        <NavLink to="/signUp" >Registreren</NavLink>
                    </li>
                </ul>}
                {hasAuth.hasAuth === true && <ul className="NavUser">
                    <li>
                        <NavLink to="/profile">Profile</NavLink>
                    </li>
                    {hasAuth.user.creator === true && <li>
                        <NavLink to="/createEvent">Create Event</NavLink>
                    </li>}
                    <li className="nav_register">
                        <NavLink to="/" onClick={logout}>Log Uit</NavLink>
                    </li>
                </ul> }

                <ul className="NavTheme">
                    <li>
                        <NavLink to="/Theater">Theater</NavLink>
                    </li>
                    <li>
                        <NavLink to="/muziek">Muziek</NavLink>
                    </li>
                    <li>
                        <NavLink to="/dans">Dans</NavLink>
                    </li>
                    <li>
                        <NavLink to="/alleEvenementen">Alle Evenementen</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
    export default NavBar;