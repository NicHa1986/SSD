import * as React from "react";
import {Routes, Route, Link} from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./views/Home";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Reports from "./views/Reports/Reports";
import {useEffect, useState} from "react";
import {auth} from "./firebase";
import PrivateRoute from "./components/PrivateRoute";
import {Spinner} from "reactstrap";
import Authorities from "./views/Authorities/Authorities";
import ITUpdates from "./views/ITUpdates/ITUpdates";
import {Helmet} from "react-helmet";
import AddNewReportPublic from "./views/Reports/AddNewReportPublic";
import AddNewAuthority from "./views/Authorities/AddNewAuthority";
import AddNewReportPrivate from "./views/Reports/AddNewReportPrivate";
import ReportView from "./views/Reports/ReportView";
import AddNewITUpdate from "./views/ITUpdates/AddNewITUpdate";

export default function App() {
    // Local state (initial declaration)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Triggered on load
    useEffect(() => {
        // Check whether a user is logged in or not
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setLoading(false);
            } else if (!user) {
                setIsLoggedIn(false);
                setLoading(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    // Loading screen, while checks are being run
    if (loading) {
        return (
            <div className={"vh-100 d-flex align-items-center justify-content-center"}>
                <Spinner>Loading...</Spinner>
            </div>
        );
    }

    return (
        <>
            {/*Used for adding meta data to a page in React.js*/}
            <Helmet>
                <meta charSet="utf-8" />
                <title>NCSC</title>
                <meta name="description" content="NCSC Application" />
            </Helmet>
            {/*Public and private routes in the NCSC App*/}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <Reports />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reportview/:uidd"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <ReportView />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/addnewreportprivate"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <AddNewReportPrivate />
                        </PrivateRoute>
                    }
                />
                <Route path="/addnewreportpublic" element={<AddNewReportPublic/>}/>
                <Route
                    path="/authorities"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <Authorities />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/addnewauthority"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <AddNewAuthority />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/itupdates"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <ITUpdates />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/addnewitupdate"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn}>
                            <AddNewITUpdate />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </>
    );
}
