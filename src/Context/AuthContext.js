import {createContext, useEffect, useState} from "react";
import checkValidationOfJWT from "../Helpers/CheckValidationOfJWT";
import jwtDecode from "jwt-decode";
import axios from "axios";


export const AuthContext = createContext({});

function AuthContextProvider({children}) {


    const [hasAuth, toggleHasAuth] = useState({
        hasAuth: false,
        user: Object,
        status: 'pending'
    });


    async function fetchUserData(decodedToken, token, redirectUrl) {
        try {
            const response = await axios.get(`http://localhost:8080/users/${decodedToken.sub}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data)
            toggleHasAuth({
                hasAuth: true,
                user: {
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    creator: response.data.creator
                },
                status: 'done'
            })

            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } catch (error) {
            console.error(error)
            toggleHasAuth({
                hasAuth: false,
                user: null,
                status: 'done'
            })
        }
    }

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token && checkValidationOfJWT(token)) {
            const decoded = jwtDecode(token);
            console.log(decoded)
            void fetchUserData(decoded, token);
        } else {
            toggleHasAuth({
                hasAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, [],);


    function login(token) {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        void fetchUserData(decodedToken, token, "/");
    }

    function logout() {
        localStorage.clear();
        toggleHasAuth({
            hasAuth: false,
            user: null,
            status: 'done'
        });
        console.log(hasAuth.hasAuth)
    }

    const contextData = {
        hasAuth: hasAuth,
        user: hasAuth.user,
        login: login,
        logout: logout,
    };


    return (
        <AuthContext.Provider value={contextData}>
            {hasAuth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;