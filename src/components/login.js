import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import '../css/login.css';
import { loginUser } from '../utils/api_factory';
import { saveToken } from '../utils/tokenUtils';

export default function Login(props) {
    const setUser = props.setUser;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginFailed, setLoginFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    
    const [errors, setErrors] = useState({});

    const isFormValid = () => {
        let formValid = true;
        if(!username || !username.length) {
            formValid = false;
            setErrors(prevErrors => {
                return {...prevErrors, username: 'Username is required'}
            })
        }
        if(!password || !password.length) {
            formValid = false;
            setErrors(prevErrors => {
                return {...prevErrors, password: 'Password is requied'}
            })
        }
        return formValid;
    };

    async function login(credentials) {
        return await loginUser(credentials).then(res => {
            return res.data
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoginFailed(false);
        if(isFormValid()) {
            const response = await login({
                username: username,
                password: password
            });
            if(!response.success) {
                setLoginFailed(true);
                setErrorMessage(response.message);
            } else {
                saveToken(response.token);
                setUser(response.user);
                props.history.push('/');
            }
        }
    };
    return(
        <div className="login-wrapper">
            <div className="col-md-3 login-form-container">
                <form className="login-form m-3" onSubmit={handleSubmit}>
                    <label className="login-form-label mb-3">
                        Login
                    </label>
                    {loginFailed ? <label className="login-form-label mb-3 text-danger">{errorMessage}</label> : null}
                    <div className="form-group">
                        <input type="text" className="form-control form-control-md" placeholder="Username" style={{ border: errors.username? '1px solid #dc3545': 'none'}} onChange={ e => setUsername(e.target.value)}/>
                        { errors.username? <small className="form-text text-danger">Please enter username.</small>: null }
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control form-control-md" placeholder="Password" style={{ border: errors.username? '1px solid #dc3545': 'none'}} onChange={ e => setPassword(e.target.value)}/>
                        { errors.password? <small className="form-text text-danger">Please enter password.</small>: null }
                    </div>
                    <div>
                        <button type="submit" className="col-md-12 login-button btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
      )
}

// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
// }