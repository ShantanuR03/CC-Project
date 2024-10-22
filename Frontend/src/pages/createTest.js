import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/createtest.css';
import { link } from '../utils/global.js';

const CreateTest = () => {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [newTestName, setNewTestName] = useState('');
    const [question, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [answer, setAnswer] = useState('');

    const created_by = "admin1";

    useEffect(() => {
        const fetchTests = async () => {            
            try {
                const response = await axios.get(`http://${link}:8000/admin/tests/${created_by}`);
                const data = await response.data;
                setTests(data.tests);
            } catch (error) {
                console.error('Error fetching tests:', error);
            }
        };

        fetchTests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const questionData = {
            question: question,
            option1: option1,
            option2: option2,
            option3: option3,
            option4: option4,
            answer: answer
        };

        const testName = selectedTest || newTestName;

        try {
            const response = await axios.post(`http://${link}:8000/tests/${created_by}/${testName}/questions`, questionData)
            if (response.status === 200) {
                // console.log('Question added successfully:', response.data);
                alert("Question added successfully!");
                setQuestion('');
                setOption1('');
                setOption2('');
                setOption3('');
                setOption4('');
                setAnswer('');
                setNewTestName('');
                setSelectedTest('');
            } else {
                console.error('Error adding question:', response.data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className='HomePage'>
            <div className='CreateTest'>
                <h1>Create Test</h1>
                <form onSubmit={handleSubmit}>
                {/* <form> */}
                    <div className='CTInput'>
                        <label>Question:</label>
                        <input
                            type="text"
                            placeholder="Enter question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                    </div>
                    <div className='CTInput'>
                        <label>Option 1:</label>
                        <input
                            type="text"
                            placeholder="Enter option 1"
                            value={option1}
                            onChange={(e) => setOption1(e.target.value)}
                            required
                        />
                    </div>
                    <div className='CTInput'>
                        <label>Option 2:</label>
                        <input
                            type="text"
                            placeholder="Enter option 2"
                            value={option2}
                            onChange={(e) => setOption2(e.target.value)}
                            required
                        />
                    </div>
                    <div className='CTInput'>
                        <label>Option 3:</label>
                        <input
                            type="text"
                            placeholder="Enter option 3"
                            value={option3}
                            onChange={(e) => setOption3(e.target.value)}
                            required
                        />
                    </div>
                    <div className='CTInput'>
                        <label>Option 4:</label>
                        <input
                            type="text"
                            placeholder="Enter option 4"
                            value={option4}
                            onChange={(e) => setOption4(e.target.value)}
                            required
                        />
                    </div>
                    <div className='CTInput'>
                        <label>Answer:</label>
                        <select value={answer} onChange={(e) => setAnswer(e.target.value)} required>
                            <option value="">Select Correct Answer</option>
                            <option value={option1}>Option 1</option>
                            <option value={option2}>Option 2</option>
                            <option value={option3}>Option 3</option>
                            <option value={option4}>Option 4</option>
                        </select>
                    </div>
                    <div className='selectTest'>
                        <div className='selectTestDD'>
                            <label>Select Test:</label>
                            <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)}>
                                <option value="">Select a Test</option>
                                {tests.map((test) => (
                                    <option key={test} value={test}>
                                        {test}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>OR</div>
                        <div className='selectTestDD'>
                            <label>Create New Test:</label>
                            <input
                                type="text"
                                placeholder="New Test Name"
                                value={newTestName}
                                onChange={(e) => setNewTestName(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit">Add Question</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTest;