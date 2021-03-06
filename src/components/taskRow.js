import PropTypes from 'prop-types';
import { useState } from 'react';
import { callUpdateAPI, callDeleteAPI } from "../utils/api_factory";
export default function TaskRow({task, fetchOverView, setFetchTasks, setSelectedTask, setShowUpdateModal}) {
    const [taskCompleted, setTaskCompleted] = useState(task.is_completed);
    const [updating, setUpdating] = useState(false);

    const handleCheckbox = () => {
        setUpdating(true);
        let is_completed = !taskCompleted;
        callUpdateAPI({
            is_completed: is_completed
        }, task._id).then(res => {
            setUpdating(false);
            setTaskCompleted(is_completed);
            fetchOverView();
        }).catch(function(err) {
            setUpdating(false);
            setTaskCompleted(!is_completed);
        })

    }

    const deleteTask = () => {
        setUpdating(true);
        callDeleteAPI(task._id).then(res => {
            setUpdating(false);
            setFetchTasks(true);
        }).catch(function(err) {
            console.log("could not delete taskk");
            console.log(err.response.data);
        })
    }
    
    const showTaskUpdateModal = () => {
        setSelectedTask(task);
        setShowUpdateModal(true);
    }

    return (
        <tr className="d-flex">
            <td className="col-2 col-lg-1">
                <label className="customcheck">
                    <input type="checkbox" checked={taskCompleted} onChange={handleCheckbox} disabled={updating}/>
                    <span className="checkmark"></span>
                </label>
            </td>
            <td className={ 
                "col-6 col-lg-9 task-name " + 
                (taskCompleted ? "task-name-completed" : "task-name-incomplete")}>
                    {task.name}
            </td>
            <td className="col-2 col-lg-1">
                <button className="btn btn-default table-button" onClick={showTaskUpdateModal}>
                    <i className="fa fa-pencil table-button-icon" aria-hidden="true"></i>
                </button>
            </td>
            <td className="col-2 col-lg-1">
                <button className="btn btn-default table-button" onClick={deleteTask} disabled={updating}>
                    <i className="fa fa-trash table-button-icon" aria-hidden="true"></i>
                </button>
            </td>
        </tr>
    )
}

TaskRow.propTypes = {
    task: PropTypes.object.isRequired,
    fetchOverView: PropTypes.func.isRequired,
    setFetchTasks: PropTypes.func.isRequired,
    setSelectedTask: PropTypes.func.isRequired,
    setShowUpdateModal: PropTypes.func.isRequired
}