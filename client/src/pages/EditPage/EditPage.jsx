import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import "./EditPage.scss";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPage = () => {
    const { eventId } = useParams(); // Capture the event ID from the URL

    const [name, setName] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState('');
    console.log(date)
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    // Fetch event data for the specific eventId
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`/api/events/${eventId}`, {
                    headers: { "Content-Type": "application/json" }
                });
                const event = response.data;

                const formattedDate = new Date(event.date).toISOString().split('T')[0];

                setName(event.name || '');
                setPlace(event.place || '');
                setDate(formattedDate || '');
                setTime(event.time || '');
                setDescription(event.description || '');
                setCategory(event.category || '');
            } catch (error) {
                console.log(error);
                toast.error("Не вдалося завантажити подію.");
            }
        };
        console.log(eventId)
        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    // Update the event
    const updateEvent = useCallback(async () => {
        if (!name || !place || !date || !time || !category) {
            toast.warn("Будь ласка, заповніть всі поля.");
            return;
        }

        try {
            await axios.put(`/api/events/update/${eventId}`, {
                name,
                place,
                date,
                time,
                description,
                category
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success("Подію успішно оновлено!");
        } catch (error) {
            console.log(error);
            toast.error("Не вдалося оновити подію.");
        }
    }, [eventId, name, place, date, time, description, category]);

    return (
        <div className='container'>
            <div className="edit-page">
                <h3>Редагувати подію</h3>
                <form className="form form login" onSubmit={e => e.preventDefault()}>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="text"
                                id="name"
                                className="validate"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <label htmlFor="name" className={name ? 'active' : ''}>Подія:</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="text"
                                id="place"
                                className="validate"
                                value={place}
                                onChange={e => setPlace(e.target.value)}
                            />
                            <label htmlFor="place" className={place ? 'active' : ''}>Місце:</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="date"
                                id="date"
                                className="validate"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                            <label htmlFor="date" className={date ? 'active' : ''}>Дата:</label>
                        </div>
                        <div className="input-field col s12">
                            <input
                                type="time"
                                id="time"
                                className="validate"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                            />
                            <label htmlFor="time" className={time ? 'active' : ''}>Час:</label>
                        </div>
                        <div className="input-field col s12">
                            <select
                                id="category"
                                className="browser-default"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="" disabled></option>
                                <option value="Конференція">Конференція</option>
                                <option value="Воркшоп">Воркшоп</option>
                                <option value="Зустріч">Зустріч</option>
                                <option value="Семінар">Семінар</option>
                                <option value="Вебінар">Вебінар</option>
                            </select>
                            <label htmlFor="category" className={`category-label ${category ? 'active' : ''}`}>Категорія:</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input  
                                type="text"
                                id="description"
                                className="validate"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            <label htmlFor="description" className={description ? 'active' : ''}>Опис:</label>
                        </div>
                    </div>
                    <div className="row">
                        <button className="waves-effect waves-light btn green" onClick={updateEvent}>Зберегти зміни</button>
                        <Link to="/" className="btn-outline">Скасувати</Link>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default EditPage;
