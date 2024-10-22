import React, { useState } from 'react';
import axios from 'axios';
import '../css/adduser.css';
import '../css/home.css';
import { link } from '../utils/global.js';

const AddUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const created_by = "admin1";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name: name,
            email: email,
            contact_number: contactNumber,
            created_by: created_by
        };

        try {
            const response = await axios.post(`http://${link}:8000/addusers`, userData);
            if (response) {
                alert("New user added successfully!");
                setName('');
                setEmail('');
                setContactNumber('');
            } else {
                console.error('Error adding user:', response.data);
            }
        } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='HomePage'>
            <div className='AddUser'>
                <h1>Add New User</h1>
                <form onSubmit={handleSubmit} className='AUForm'>
                {/* <div> */}
                    {/* <label>Name:</label> */}
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                {/* </div> */}
                {/* <div> */}
                    {/* <label>Email:</label> */}
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                {/* </div> */}
                {/* <div> */}
                    {/* <label>Contact Number:</label> */}
                    <input
                        type="text"
                        placeholder="Enter contact number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        required
                    />
                {/* </div> */}
                    <button type="submit">Add User</button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;