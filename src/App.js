import './App.css';
import Home from "./components/home";
import Login from "./components/login";
import { BrowserRouter, Switch } from "react-router-dom";
// import $ from "jquery";
// import Popper from 'popper.js';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PublicRoute from './utils/publicRoute';
import PrivateRoute from "./utils/privateRoute";
import { getToken, removeToken } from "./utils/tokenUtils";
import { API } from './utils/axios';
import React from 'react';

export const AppContext = React.createContext();
function App() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = getToken();
        if(!token) {
            setUser({});
            return;
        }
        API.get('/me', {
            headers: {
                'x-access-token': getToken()
            }
        }).then(res => {
            setUser(res.data);
        }).catch(err => {
            setUser({});
            removeToken();
        });
    }, []);
    return (
        <section className="App">
            <BrowserRouter>
                <Switch>
                    <PublicRoute path="/login" component={Login} />
                    <AppContext.Provider value={user}>
                        <PrivateRoute exact path="/" component={Home} />
                    </AppContext.Provider>
                </Switch>
            </BrowserRouter>
        </section>
    );
}

export default App;
