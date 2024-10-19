import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import "./CreatePage.scss";

const CreatePage = () => {
    const [name, setName] = useState('');
    const {userId} = useContext(AuthContext)
    const [events, setEvents] = useState([])

    const createEvent = useCallback(async () => {
        if(!name) return null
        try {
            await axios.post('/api/events/create', {name, userId}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                setEvents([...events], response.data)
                setName('')
            })
        } catch (error) {
            console.log(error)
        }
    }, [name, userId, events])
    
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
                        <button className="waves-effect waves-light btn green" onClick={createEvent}>Додати</button>
                        <Link to="/" className="btn-outline">Скасувати</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePage;
