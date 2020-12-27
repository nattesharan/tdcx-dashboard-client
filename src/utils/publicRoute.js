import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PublicRoute({component: Component, ...rest}) {
    let token = localStorage.getItem('token') || null;
    return (
        <Route {...rest} render={(props) => !token ? 
            <Component {...props} /> : <Redirect to={{ pathname: '/' }} />} 
        />
    )
}

export default PublicRoute;

