import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUser, getUsers, deleteUser, updateGeneralDetails } from "./redux/actions/users"
import { getSections, updateSection, addSectionChild, updateSectionChild, addSection, deleteSection, deleteSectionChild } from "./redux/actions/sections";
import React from "react";
import Authenticate from "./components/Auth/Authenticate";
import Loader from "./components/Loader/Loader";
import HomePage from "./pages/public/HomePage/HomePage";
import ProfilePage from "./pages/public/ProfilePage/ProfilePage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminHomePage from "./pages/admin/AdminHomePage";

// function App() {
//   const [loading, setLoading] = useState(true)
//   const dispatch = useDispatch();

//   const currentUser = "Cynaptics"


import './index.css';




function App() {
    const [loading, setLoading] = useState(true)
    const currentUser = "Cynaptics"
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser(currentUser))
        dispatch(getSections(currentUser))
        setLoading(false)
    }, [dispatch]);


    const data = useSelector((state) => state)
    console.log(data)

    return (
        <>
            <Router>
                {
                    loading ? <Loader /> :
                        <div className="App">
                            {/* <button onClick={() => dispatch(updateSection("Cynaptics", 2))}>Sections Action</button> */}

                            <Routes>
                                <Route path='/' element={<><h1>Welcome to Gymkhana IITI</h1> <Link to='/home'>Go to Home</Link></>} />
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/adminhome" element={<AdminHomePage />} />
                                <Route path="/adminprofile" element={<AdminProfilePage />} />
                                <Route path="/login" element={<Authenticate />} />
                            </Routes>
                        </div>
                }

            </Router>
        </>
    );
}

export default App;

