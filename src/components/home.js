import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../App";
import { removeToken } from '../utils/tokenUtils';
import CreateTask from './createTask';
import TaskRow from "./taskRow";
import '../css/homepage.css';
import { API } from '../utils/axios';
import {CanvasJSChart} from 'canvasjs-react-charts';
import UpdateTask from "./updateTask";
import { getToken } from "../utils/tokenUtils";

export default function Home(props) {
    const user = useContext(AppContext)
    console.log(user);
    const [tasks, setTasks] = useState([]);
    const [overviewData, setOverViewData] = useState({});
    const [fetchTasks, setFetchTasks] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState();

      
    const fetchAvailableTasks = (searchTerm) => {
        var urlEndpoint = '/tasks';
        if(searchTerm && searchTerm.length) {
            urlEndpoint += `?searchTerm=${searchTerm}`;
        }
        API.get(urlEndpoint, {
            headers: {
                'x-access-token': getToken()
            }
        }).then(res => {
            setTasks(res.data);
        }).catch(function(err) {
            console.log("error occured while fehcing tasks...")
            console.log(err.response.data);
        })
    }
    
    const searchTasks = (e) => {
        e.preventDefault();
        if(searchTerm && searchTerm.length) {
            fetchAvailableTasks(searchTerm);
        }
    }
    const fetchOverView = () => {
        API.get('/overview', {
            headers: {
                'x-access-token': getToken()
            }
        }).then(res => {
            setOverViewData(res.data);
        })
    }
    useEffect(() => {
        if(fetchTasks) {
            fetchAvailableTasks();
            fetchOverView();
            setFetchTasks(false);
        }
    }, [fetchTasks])

    const logoutUser = () => {
        removeToken();
        props.history.push('/login');
    }

    const showTaskCreationModal = () => {
        setShowCreateModal(true);
    }

    const getTaskCreationUI = () => {
        if(showCreateModal) {
            return <CreateTask setShowCreateModal={setShowCreateModal} setFetchTasks={setFetchTasks}/>
        }
        return null;
    }
    
    const getTaskUpdationUI = () => {
        if(showUpdateModal) {
            return  <UpdateTask task={selectedTask} setShowUpdateModal={setShowUpdateModal} setFetchTasks={setFetchTasks} setSelectedTask={setSelectedTask}/>
        }
        return null;
    }

    const getLatestTasksList = () => {
        if(overviewData.latestTasks && overviewData.latestTasks.length === 3) {
            return (
                <ul className="m-0 latest-tasks-list">
                    {
                        overviewData.latestTasks.map((latestTask, index) => {
                            return (<li className={
                                        "latest-tasks-list-item mb-1 " +
                                        (latestTask.is_completed ? "latest-task-completed" : "")
                                        } key={index}>
                                            {latestTask.name}
                                    </li>);
                        })
                    }
                </ul>
            )
        }
        return (<h5 className="card-title overview-title">Not Enough Data</h5>);
    }
    const getPieChart = () => {
        if(overviewData.total && overviewData.total > 0) {
            return (
                <CanvasJSChart options={{
                    animationEnabled: true,
                    containerProps: {width: "100%", height: "130px"},
                    height: 130,
                    toolTip: {
                        enabled: false
                    },
                    data: [{
                        type: "pie",
                        indexLabel: "{label}: {y}%",		
                        startAngle: -90,
                        dataPoints: [
                            { y: overviewData.complete, label: "Completed Tasks", color: "#5285EC"},
                            { y: overviewData.incomplete, label: "Incomplete Tasks", color: '#E8ECEC' }
                        ]
                    }]
                }}/>
            )
        }
        return (<h5 className="card-title overview-title">Not Enough Data</h5>);
    }

    const getOverViewUI = () => {
        if(overviewData) {
            return (
                <div className="row mt-4">
                    <div className="col-md-4 col-lg-4 col-sm-12 mb-3">
                        <div className="card dashboard-card h-100">
                            <div className="card-body">
                                <h5 className="card-title overview-title">Tasks Completed</h5>
                                <div className="card-content-wrapper">
                                    {
                                        overviewData.total > 0 ?
                                        <p className="card-text completed-tasks-label">{overviewData.complete}<sub className="total-task-label">/{overviewData.total}</sub></p>:
                                        <h5 className="card-title overview-title">Not Enough Data</h5>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-12 mb-3">
                        <div className="card dashboard-card h-100">
                            <div className="card-body">
                                <h5 className="card-title overview-title">Latest Tasks</h5>
                                <div className="card-content-wrapper" style={overviewData.latestTasks && overviewData.latestTasks.length === 3 ? { alignItems: 'flex-end' }:null }>
                                    {getLatestTasksList()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-12 mb-3">
                        <div className="card dashboard-card h-100">
                            <div className="card-body">
                                <div className="card-content-wrapper">
                                    {getPieChart()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    const renderTableRows = () => {
        return tasks.map((task, index) => {
            return (
                <TaskRow task={task} key={index} fetchOverView={fetchOverView} setFetchTasks={setFetchTasks} setSelectedTask={setSelectedTask} setShowUpdateModal={setShowUpdateModal}/>
            )
        })
    }
    const shouldShowAlert = () => {
        if(showCreateModal) {
            return {
                display: 'none'
            };
        }
        return {
            display: 'block'
        };
    }


    const renderTasksUI = () => {
        if(tasks.length || (searchTerm && searchTerm.length)) {
            return (
                <section>
                    {getTaskCreationUI()}
                    {getTaskUpdationUI()}
                    <section className="home-main container-fluid w-75">
                        {getOverViewUI()}
                        <div className="row mt-4 mt-sm-2 align-elements-middle">
                            <div className="col-md-2 col-lg-5 col-sm-12 text-md-left text-lg-left text-center">
                                <label className="tasks-label">Tasks</label>
                            </div>
                            <div className="row col-md-10 col-lg-7 col-sm-12 m-0">
                                <div className="col-md-8 col-lg-8 col-sm-12 m-sm-2 m-2 m-lg-0 m-md-0 p-sm-0">
                                    <form className="search-task-form" onSubmit={searchTasks}>
                                        <div className="input-group">
                                            <span className="input-group-addon p-2 ml-1 mr-1"><i className="fa fa-search" aria-hidden="true"></i></span>
                                            <input type="text" className="form-control form-control-lg pl-1" placeholder="Search by task name" onChange={(e) => {setSearchTerm(e.target.value)}}/>
                                        </div>
                                        <div>
                                            <button type="submit" hidden>Search</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 m-sm-2 m-2 m-lg-0 m-md-0">
                                    <button type="submit" className="col-md-12 create-task-button btn btn-primary" onClick={showTaskCreationModal}>Create Task</button>
                                </div>
                            </div>
                            <div className="row col-md-12 mt-4 tasks-table-container p-4 mb-4 table-responsive-sm">
                                {
                                    tasks.length ?
                                        <table className="table table-borderless tasks-table m-0">
                                            <tbody>
                                                {renderTableRows()}
                                            </tbody>
                                        </table>: <div className="col-12 row tasks-label" style={{justifyContent: 'center', fontSize: '16px'}}>No tasks found.</div>
                                }
                            </div>
                        </div>
                    </section>
                </section>
            );
        }
        return (
            <section className="create-task-alert-main container-fluid">
                <div></div>
                {getTaskCreationUI()}
                <div className="create-task-alert-wrapper h-100">
                    <div className="col-lg-3 col-md-4 create-task-alert-container" style={shouldShowAlert()}>
                        <div className="create-task-alert-form m-4">
                            <label className="create-task-alert-form-label mb-4">
                                You have no tasks.
                            </label>
                            <div>
                                <button className="add-task-button col-md-6 btn btn-primary" onClick={showTaskCreationModal}>+ New Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <div className="homepage">
            <div className="header sticky-top">
                <nav className="navbar navbar-background pl-5 pr-5">
                    <span className="navbar-brand user-avatar-info">
                        <img src={user.avatar} className="d-inline-block align-top user-avatar" alt="" loading="lazy" />
                        <span className="navbar-brand mb-0 username ml-2 mr-2">{user.firstname}</span>
                    </span>
                    <span className="navbar-text">
                        <button type="button" className="btn btn-link logout-button" onClick={logoutUser}>Logout</button>
                    </span>
                </nav>
            </div>
            {renderTasksUI()}
        </div>
    );
}