import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/home.css';
import '../css/adminhome.css';
import { link } from '../utils/global.js';

const UserHome = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [test, setTest] = useState('');

    useEffect(() => {
        const fetchTest = async () => {            
            try {
                const response = await axios.get(`http://${link}:8000/gettest/${userId}`);
                if(response){
                    setTest(response.data);
                }
            } catch (error) {
                console.error('Error fetching test:', error);
            }
        };

        fetchTest();
    }, []);

    const handleStartTest = () => {
        navigate(`/user/testpage/${userId}`);
    }

    return (
        <div className='HomePage'>
            <div className='AHBody'>
                <h1>Assigned Test</h1>
                {test ?
                (<div className='startTest'>
                    <div>Test Name: </div>
                    <div><strong>{test}</strong></div>
                    <button onClick={handleStartTest} id='starttestbtn'>Start Test</button>
                </div>):
                (<div>No test is scheduled for you!</div>)
                }
            </div>
        </div>
    );
};

export default UserHome;