import { useEffect, useState } from "react";
import UserHomePage from './UserHomePage'
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/userSlice";
import { socket } from "../socket";
import Loading from "../components/Loading";

export default function Home() {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.users);

    // useEffect(() => {
    //     console.log("home");
    //     const apiUrl = process.env.REACT_APP_API_URL;
    //     fetch(`${apiUrl}/home`, { method: 'POST' })
    //         .then(res => res.json())
    //         .then(res => {
    //             console.log(res.authenticated);
    //             setUserData(res);
    //         })
    // }, [])

    // if (userData.authenticated === 0) {
    //     return <Navigate to="/" replace={true} />;
    // }
    if (true) {
        // dispatch(setUser(userData));
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