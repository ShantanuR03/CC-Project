import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/assigntest.css';
import { link } from '../utils/global.js';

const AssignTest = () => {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const admin = "admin1";

    useEffect(() => {
        const fetchTests = async () => {            
            try {
                const response = await axios.get(`http://${link}:8000/admin/tests/${admin}`);
                const data = await response.data;
                console.log(response.data);
                
                setTests(data.tests);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchTests();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://${link}:8000/admin/users/${admin}`);
                console.log(response.data);

                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleTestSelection = (e) => {
        setSelectedTest(e.target.value);
    };

    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelectedUsers) => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter((id) => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTest || selectedUsers.length === 0) {
            alert('Please select a test and at least one user');
            return;
        }

        try {
            const response = await axios.put(`http://${link}:8000/admin/assign-test`, {
                test_name: selectedTest,
                users: selectedUsers,
            });

            if (response.status === 200) {
                alert('Test assigned successfully');
                setSelectedTest('');
                setSelectedUsers([]);
            } else {
                console.error('Error assigning test:', response.data);
            }
        } catch (error) {
            console.error('Error assigning test:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='HomePage'>
            <h1 className='ATHeading'>Assign Test to Users</h1>
            <div className='AssignTest'>
                <form onSubmit={handleSubmit}>
                    <div className='selectTestAT'>
                        <label>Select Test:</label>
                        <select value={selectedTest} onChange={handleTestSelection} required>
                            <option value="">Select Test</option>
                            {tests && tests.length > 0 ? (
                            tests.map((test) => (
                                <option key={test} value={test}>
                                    {test}
                                </option>
                            ))
                        ):(<p></p>)}
                        </select>
                    </div>
                    <hr></hr>
                    <div className='usersList'>
                        <h2>Select Users to Assign the Test:</h2>
                        <ul>
                            {users && users.length > 0 ? 
                            users.map((user) => (
                                <li key={user.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleUserSelection(user.id)}
                                        />
                                        {user.name} ({user.email})
                                    </label>
                                </li>
                            )):(<p>No users remaining to assign test</p>)}
                        </ul>
                    </div>
                    <div className='ATsubmitbtn'>
                        <button type="submit">Assign Test</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignTest;