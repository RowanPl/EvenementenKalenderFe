import './App.css';
import NavBar from "./Components/NavBar";
import {Route, Routes} from "react-router-dom";
import Theater from "./Pages/Theater";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Music from "./Pages/Music";
import Dance from "./Pages/Dance";
import All from "./Pages/All";
import Main from "./Pages/Main";
import "./Pages/Main.css";
import Profile from "./Pages/Profile";
import EventPage from "./Pages/EventPage";
import CreateEvent from "./Pages/CreateEvent";
import {useContext} from "react";
import {AuthContext} from "./Context/AuthContext";


function App() {
    const {hasAuth} = useContext(AuthContext)
    return (
        <>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/theater" element={<Theater/>}/>
                <Route path="/muziek" element={<Music/>}/>
                <Route path="/dans" element={<Dance/>}/>
                <Route path="/signIn" element={<SignIn/>}/>
                <Route path="/signUp" element={<SignUp/>}/>
                <Route path="/alleEvenementen" element={<All/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path={"/createEvent"} element={<CreateEvent/>}/>
                <Route path="/events/:id" element={hasAuth.hasAuth ? <EventPage/> :
                    <SignIn><p className="required">Je moet ingelogd zijn om evenementen te bekijken</p></SignIn>}/>

            </Routes>
        </>
    );
}

export default App;
