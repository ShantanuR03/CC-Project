import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/home.css';
import { link } from '../utils/global.js';

const HomePage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name: name,
            email: email,
            contact_number: contactNumber,
        };

        try {
            const response = await axios.post(`http://${link}:8000/checkuser`, userData);
            if (response.data != "No user found") {
                navigate(`/user/home/${response.data}`);
                setName('');
                setEmail('');
                setContactNumber('');
            } else {
                alert("Credentials do not match!! Try again")
            }
        } catch (error) {
            console.error();
        }
    };

    const handleAdminLogin = () => {
        navigate('/admin/home');
    }

    const toggleForm = () => {
        if(showForm){
            setShowForm(false);
        }
        else{
            setShowForm(true);
        }
    }

    return (
        <div className='HomePage'>
            {showForm &&
            <div className='verifyDetails'>
                <div className='verifyDetailsBody'>
                    <h1>Enter User Details</h1>
                    <form onSubmit={handleSubmit} className='AUForm'>
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Enter contact number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                        <div id='closeForm' onClick={toggleForm}>Close</div>
                    </form>
                </div>
            </div>
            }

            <div className='HPBody'>
                <h1>Login As</h1>
                <div className='HPbtn'>
                    <button onClick={handleAdminLogin}>Admin</button>
                    <button onClick={toggleForm}>User</button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;