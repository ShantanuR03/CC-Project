import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/checkresult.css';
import { link } from '../utils/global.js';

const CheckResult = () => {
    const [scores, setScores] = useState([]);
    const [adminId, setAdminId] = useState('');  

    const admin = "admin1";

    useEffect(() => {
        const checkResult = async () => {
            try {
                const response = await axios.get(`http://${link}:8000/admin/scores/${admin}`);
                setScores(response.data);
            } catch (err) {
                console.error('Error fetching scores:', err);
            }
        };
        checkResult();
    }, []);

    return (
        <div className='HomePage'>
            <h1 id='CRHeading'>View User Scores</h1>
            <div className='CRBody'>
                {scores.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                {/* <th>User ID</th> */}
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Test</th>
                                <th>Score</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((user) => (
                                <tr key={user.id}>
                                    {/* <td>{user.id}</td> */}
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.contact_number}</td>
                                    <td>{user.assigned_test}</td>
                                    <td>{user.score}</td>
                                    <td>{(user.score > 3) ? <span>Passed</span> : <span>Failed</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No scores available.</p>
                )}
            </div>
        </div>
    );
};

export default CheckResult;