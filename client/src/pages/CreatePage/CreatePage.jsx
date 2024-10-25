import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "./CreatePage.scss";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePage = () => {
    const [name, setName] = useState('');
    const [place, setPlace] = useState(''); // New state for place
    const [date, setDate] = useState(''); // New state for date
    const [time, setTime] = useState(''); // State for time
    const [description, setDescription] = useState(''); // New state for description
    const [category, setCategory] = useState(''); // New state for category
    const { userId } = useContext(AuthContext);
    const [events, setEvents] = useState([]);

    const createEvent = useCallback(async () => {
        if (!name || !place || !date || !time || !category) {
            alert("Будь ласка, заповніть всі поля."); 
            return null;
        }

        try {
            const response = await axios.post('/api/events/create', {
                name,
                place,
                date,
                time,
                description,
                category,
                userId
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            setEvents([...events, response.data]); // Correctly add the new event to the events state
            setName('');
            setPlace('');
            setDate('');
            setTime('');
            setDescription('');
            setCategory('');
            toast.success("Подію успішно створено!");
        } catch (error) {
            console.log(error);
        }
    }, [name, place, date, time, description, category, userId, events]);

    return (
        <div className='container'>
            <div className="create-page">
                <h3>Додати подію</h3>
                <form className="form form login" onSubmit={e => e.preventDefault()}>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="text"
                                id="name"
                                name="input"
                                className="validate"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <label htmlFor="input">Подія: </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="text"
                                id="place"
                                name="place"
                                className="validate"
                                value={place}
                                onChange={e => setPlace(e.target.value)}
                            />
                            <label htmlFor="place">Місце: </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="date" 
                                id="date"
                                name="date"
                                className="validate"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                            <label htmlFor="date">Дата: </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input 
                                type="time" // Use type "time" for time input
                                id="time"
                                className="validate"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                            />
                            <label htmlFor="time">Час: </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="text"
                                id="description"
                                name="description"
                                className="validate"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            <label htmlFor="description">Опис: </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="text"
                                id="category"
                                name="category"
                                className="validate"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            />
                            <label htmlFor="category">Категорія: </label>
                        </div>
                    </div>
                    <div className="row">
                        <button className="waves-effect waves-light btn green" onClick={createEvent}>Додати</button>
                        <Link to="/" className="btn-outline">Скасувати</Link>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default CreatePage;
