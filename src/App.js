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
import { getProfile } from './utils/api_factory';
import React from 'react';

export const AppContext = React.createContext();
function App() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = getToken();
        if(!token) {
            setUser({});
            return;
        }
        setLoading(true);
        getProfile().then(res => {
            setLoading(false);
            setUser(res.data);
        }).catch(err => {
            setLoading(false);
            removeToken();
            setUser({});
        });
    }, []);
    if(loading) {
        return (
            <section className="App">
                <h1 className="loadingPage"><i class="fa fa-spinner fa-spin"></i></h1>
            </section>
        );
    }
    return (
        <section className="App">
            <BrowserRouter>
                <Switch>
                    <PublicRoute path="/login" component={props => <Login {...props} setUser={setUser} />}/>
                    <AppContext.Provider value={user}>
                        <PrivateRoute exact path="/" component={Home} />
                    </AppContext.Provider>
                </Switch>
            </BrowserRouter>
        </section>
    );
}

export default App;
