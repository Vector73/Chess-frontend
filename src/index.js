import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Home from './screens/Home'
import Register from './screens/Register'
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import Login from "./screens/Login";
import Play from "./screens/Play";
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import Game from "./screens/Game";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from "./components/ProtectedRoute";
import {disableReactDevTools} from '@fvilers/disable-react-devtools';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/home", element: <ProtectedRoute allowedRoutes={['/sign-in', '/sign-up']}><Home /></ProtectedRoute> },
            { path: "/sign-up", element: <Register /> },
            { path: "/sign-in", element: <Login /> },
            {
                path: "/chess/",
                element: <ProtectedRoute allowedRoutes={['/sign-in', '/sign-up']}><Play /></ProtectedRoute>,
                children: [
                    { path: ":gameId", element: <ProtectedRoute allowedRoutes={['/sign-in', '/sign-up']}><Game /></ProtectedRoute> },
                ],
            },
        ],
    },
]);

if (process.env.NODE_ENV === 'production') disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router}>
                    <App />
                </RouterProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
