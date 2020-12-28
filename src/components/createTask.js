import '../css/createTasks.css';
import PropTypes from 'prop-types';
import { createRef, useEffect, useState } from 'react';
import { API } from '../utils/axios';
import { getToken } from '../utils/tokenUtils';
export default function CreateTask({setShowCreateModal, setFetchTasks}) {
    const [taskName, setTaskName] = useState();
    const [errors, setErrors] = useState({});
    const [loginFailed, setLoginFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const formModalRef = createRef()

    const handleOutsideClick = (e) => {
        if(!formModalRef.current.contains(e.target)) {
            setShowCreateModal(false);
        }
    }
    useEffect(() => {
        window.addEventListener('click', handleOutsideClick);
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        }
    });

    const formValid = () => {
        let isFormValid = true;
        if(!taskName || !taskName.length) {
            isFormValid = false;
            setErrors({taskName: 'Task name is required'})
        }
        return isFormValid;
    }

    const createTask = (payload) => {
        API.post('/tasks', payload, {
            headers: {
                'x-access-token': getToken()
            }
        }).then(res => {
            setShowCreateModal(false);
            setFetchTasks(true);
        }).catch(function(err) {
            setLoginFailed(true);
            setErrorMessage(err.response.data._message);
        })
    }

    const handleTaskCreation = (e) => {
        e.preventDefault();
        setErrors({})
        setLoginFailed(false);
        if(formValid()) {
            createTask({
                name: taskName
            });
        }
    }
    return (
        <div className="create-task-wrapper">
            <div className="col-lg-3 col-md-4 create-task-container" ref={formModalRef}>
                <form className="create-task-form m-4" onSubmit={handleTaskCreation}>
                    <label className="create-task-form-label mb-4">
                        + New Task
                    </label>
                    {loginFailed ? <label className="login-form-label mb-3 text-danger">{errorMessage}</label> : null}
                    <div className="form-group">
                        <input type="text" className="form-control form-control-md" placeholder="Task Name" style={{ border: errors.taskName? '1px solid #dc3545': 'none'}} onChange={(e) => setTaskName(e.target.value)}/>
                        { errors.taskName? <small className="form-text text-danger">{errors.taskName}</small>: null }
                    </div>
                    <div>
                        <button type="submit" className="col-md-12 create-task-submit-button btn btn-primary">Create Task</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

CreateTask.propTypes = {
    setShowCreateModal: PropTypes.func.isRequired,
    setFetchTasks: PropTypes.func.isRequired
}