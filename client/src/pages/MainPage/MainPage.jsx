import React, {useState, useContext, useCallback} from 'react';
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext';

import "./MainPage.scss"

const MainPage = () => {
    const [name, setName] = useState('');
    const {userId} = useContext(AuthContext)
    const [events, setEvents] = useState([])

    const createEvent = useCallback(async () => {
        if(!name) return null
        try {
            await axios.post('/api/events/add', {name, userId}, {
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
                    <div className="row flex events-item">
                        <div className="col events-num">1</div>
                        <div className="col events-text">Text</div>
                        <div className="col events-buttons">
                            <i className="material-icons blue-text">check</i>
                            <i className="material-icons orange-text">warning</i>
                            <i className="material-icons red-text">delete</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
