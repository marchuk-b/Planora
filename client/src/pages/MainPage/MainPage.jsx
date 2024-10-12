import React, {useState, useContext, useCallback, useEffect} from 'react';
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext';

import "./MainPage.scss"

const MainPage = () => {
    const [name, setName] = useState('');
    const {userId} = useContext(AuthContext)
    const [events, setEvents] = useState([])

    const getEvent = useCallback(async () => {
        try {
            await axios.get('/api/events', {
                headers: {
                    "Content-Type": "application/json"
                },
                params: {userId}
            })
            .then(response => setEvents(response.data))
        } catch (error) {
            console.log(error)
        }
    }, [userId])

    const createEvent = useCallback(async () => {
        if(!name) return null
        try {
            await axios.post('/api/events/add', {name, userId}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                setEvents([...events], response.data)
                setName('')
                getEvent()
            })
        } catch (error) {
            console.log(error)
        }
    }, [name, userId, events, getEvent])

    const removeEvent = useCallback(async (id) => {
        try {
            await axios.delete(`/api/events/delete/${id}`, {id}, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(() => getEvent())

        } catch (error) {
            console.log(error)
        }
    }, [getEvent])


    // Call getEvent inside useEffect
    useEffect(() => {
        getEvent();
    }, [getEvent]);

    return (
        <div className="container">
            <div className="main-page">
                <h4>Додати подію</h4>
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
                    </div>
                </form>

                <h3>Створені події</h3>
                <div className="events">
                    {
                       events.length > 0 ? (
                            events.map((event, index) => (
                                <div className="row flex events-item" key={index}>
                                    <div className="col events-num">{index + 1}</div>
                                    <div className="col events-text">{event.name}</div>
                                    <div className="col events-buttons">
                                        <i className="material-icons blue-text">check</i>
                                        <i className="material-icons orange-text">warning</i>
                                        <i className="material-icons red-text" onClick={() => removeEvent(event._id)}>delete</i>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Немає створених подій</p>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default MainPage;
