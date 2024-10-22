import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/home.css';
import '../css/adminhome.css';

const AdminHome = () => {
    const navigate = useNavigate();

    const handleAddUser = () => {
        navigate('/admin/adduser');
    }

    const HandleAddTest = () => {
        navigate('/admin/createtest');
    }

    const handleAssignUser = () => {
        navigate('/admin/assigntest');
    }

    const handleCheckResult = () => {
        navigate('/admin/checkresult');
    }

    return (
        <div className='HomePage'>
            <div className='AHBody'>
                <h1>Welcome Admin</h1>
                <button onClick={handleAddUser}>Add New User</button>
                <button onClick={HandleAddTest}>Add/Edit Test</button>
                <button onClick={handleAssignUser}>Assign Test</button>
                <button onClick={handleCheckResult}>Check Result</button>
            </div>
        </div>
    );
};

export default AdminHome;