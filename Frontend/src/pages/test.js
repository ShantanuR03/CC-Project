import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/testpage.css';
import { link } from '../utils/global.js';

const UserTest = () => {
    const { userId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [testName, setTestName] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`http://${link}:8000/users/${userId}`);
                if(response){
                    const questionsResponse = await axios.get(`http://${link}:8000/questions/${response.data.created_by}/${response.data.assigned_test}`);
                    const questionsArray = Object.keys(questionsResponse.data.questions).map(key => ({
                        ...questionsResponse.data.questions[key],
                        id: key 
                    }));
                    setQuestions(questionsArray);
                }
            } catch (error) {
                console.error('Error fetching test or user:', error);
            }
        };

        fetchTest();
    }, [userId]);

    const handleOptionChange = (questionIndex, selectedOption) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: selectedOption,
        });
    };

    const handleSubmitTest = async () => {
        let calculatedScore = 0;

        questions.forEach((question, index) => {
            const correctAnswer = question.answer;
            console.log(correctAnswer+index);
            
            if (selectedAnswers[index] === correctAnswer) {
                calculatedScore += 1;
                console.log("Question "+index+" is correct");
                console.log("Ans: ", question.answer);
                console.log("Selected ans: ", selectedAnswers[index]);
            }
        });

        setScore(calculatedScore);
        console.log(calculatedScore);

        try {
            await axios.put(`http://${link}:8000/assignscore/${userId}/${calculatedScore}`);
            navigate('/thanks');
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };

    return (
        <div className='TestPage'>
            <div className='TestPageBody'>
                <form>
                    {questions.map((question, index) => (
                        <div key={index} className='question'>
                            <p>{index + 1}. {question.question}</p>
                            <div>
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="option1"
                                    onChange={() => handleOptionChange(index, question.option1)}
                                /> {question.option1}
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="option2"
                                    onChange={() => handleOptionChange(index, question.option2)}
                                /> {question.option2}
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="option3"
                                    onChange={() => handleOptionChange(index, question.option3)}
                                /> {question.option3}
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="option4"
                                    onChange={() => handleOptionChange(index, question.option4)}
                                /> {question.option4}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleSubmitTest} id='endtestbtn'>End Test</button>
                </form>
            </div>
        </div>
    );
};

export default UserTest;