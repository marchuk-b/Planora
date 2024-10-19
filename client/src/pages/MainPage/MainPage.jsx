import React, {useState, useContext, useCallback, useEffect} from 'react';
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext';

import "./MainPage.scss"

const MainPage = () => {
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
                <h3>Створені події</h3>
                <div className="events">
                    {
                       events.length > 0 ? (
                            events.map((event, index) => (
                                <div className="row flex events-item" key={index}>
                                    <div className="col events-num">{index + 1}</div>
                                    <div className="col events-text">{event.name}</div>
                                    <div className="col events-buttons">
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
