import React, {useState, useContext, useCallback, useEffect} from 'react';
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import "./MyEventsPage.scss"
import EventCard from '../../components/EventCard';

const MyEventsPage = () => {
    const {userId} = useContext(AuthContext)
    const [events, setEvents] = useState([])
    const [followedEventsIds, setFollowedEventsIds] = useState([]);

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

    // Helper function to format date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(); // Format as per your preference
    };

    function getUsernameFromEmail(email) {
        if (!email || typeof email !== 'string') return 'Невідомий';
        return email.split('@')[0];
    }

    useEffect(() => {
        const fetchFollowed = async () => {
            try {
                // Fetch the IDs of followed events
                const response = await axios.get(`/api/events/followed/${userId}`, {
                    headers: { "Content-Type": "application/json" }
                });
    
                const followedEventIds = response.data; // Assuming this is an array of IDs
    
                // Fetch detailed data for each followed event
                const eventDetailsPromises = followedEventIds.map(id =>
                    axios.get(`/api/events/${id}`, {
                        headers: { "Content-Type": "application/json" }
                    })
                );
    
                const eventDetailsResponses = await Promise.all(eventDetailsPromises);
                const eventDetails = eventDetailsResponses.map(res => res.data);
    
                // Add userName to each event
                const eventsWithUserName = eventDetails.map(event => ({
                    ...event,
                    userName: getUsernameFromEmail(event.owner?.email || event.user?.email || event.creatorEmail || event.user) // Перевірте можливі властивості
                }));
    
                setFollowedEventsIds(eventsWithUserName);
            } catch (error) {
                console.error("Error fetching followed events:", error);
            }
        };
    
        if (userId) {
            fetchFollowed();
        }
    }, [userId]);

    return (
        <div className="container">
            <div className="main-page">
                <h3>Створені події</h3>
                <div className="events">
                    {
                        events.length > 0 ? (
                            events.map((event, index) => (
                                <div className="row flex events-item" key={event._id}>
                                    <div className="col events-num">{index + 1}</div>
                                    <div className="col events-text">
                                        <div><strong>Назва:</strong> {event.name}</div>
                                        <div><strong>Місце:</strong> {event.place}</div>
                                        <div><strong>Дата:</strong> {formatDate(event.date)}</div>
                                        <div><strong>Час:</strong> {event.time}</div>
                                        <div><strong>Опис:</strong> {event.description}</div>
                                        <div><strong>Категорія:</strong> {event.category}</div>
                                    </div>
                                    <div className="col events-buttons">
                                        <Link to={`/update/${event._id}`}>
                                            <i className="material-icons blue-text">edit</i>
                                        </Link>
                                        <i className="material-icons red-text" onClick={() => removeEvent(event._id)}>delete</i>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Немає створених подій</p>
                        )
                    }
                </div>
                <div className="followed-events">
                    <h4>Вподобані події</h4>
                    <div className="events-list">
                        {followedEventsIds.length > 0 ? (
                            followedEventsIds.map(followedEvent => (
                                <EventCard key={followedEvent._id} event={followedEvent} userId={userId} followedEventsIds={followedEventsIds} onFollowChange={() => {}}/>
                            ))
                        ) : (
                            <p>Ви не вподобали жодної події</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyEventsPage;
