import { useEffect, useState } from "react";
import UserHomePage from './UserHomePage'
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import { socket } from "../socket";
import Loading from "../components/Loading";

export default function Home() {
    const [userData, setUserData] = useState({ authenticated: -1 })
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("home");
        const apiUrl = process.env.BASE_URL;
        fetch(apiUrl+"/home", { method: 'POST' })
            .then(res => res.json())
            .then(res => {
                console.log(res.authenticated);
                setUserData(res);
            })
    }, [])

    if (userData.authenticated === 0) {
        return <Navigate to="/" replace={true} />;
    }
    else if (userData.authenticated === 1) {
        dispatch(setUser(userData));
        console.log(userData.username)
        socket.emit("username", { username: userData.username })
        return <UserHomePage />;
    }
    else {
        return (
            <div className="body">
                <Loading />
            </div>
        )
    }
}