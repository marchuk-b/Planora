import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.scss';
import Search from '../../components/Search';

const MainPage = () => {
    const [events, setEvents] = useState([]); // State to store all events
    const [filteredEvents, setFilteredEvents] = useState([]); // Events after filtering

    // Helper function to get username from email
    function getUsernameFromEmail(email) {
        if (!email || typeof email !== 'string') return 'Невідомий';
        return email.split('@')[0];
    }

    // Fetch all events
    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await axios.get('/api/events/all', {
                    headers: { "Content-Type": "application/json" }
                });

                const eventsWithUserName = response.data.map(event => ({
                    ...event,
                    userName: getUsernameFromEmail(event.owner?.email || event.user) // Adjust based on actual data structure
                }));
                
                setEvents(eventsWithUserName);
                setFilteredEvents(eventsWithUserName);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchAllEvents();
    }, []);

    // Function to handle search filtering
    const handleSearch = (query, searchBy) => {
        const filtered = events.filter(event => {
            if (searchBy === "name") {
                return event.name.toLowerCase().includes(query.toLowerCase());
            } else if (searchBy === "category") {
                return event.category.toLowerCase().includes(query.toLowerCase());
            } else if (searchBy === "userName") {
                return event.userName.toLowerCase().includes(query.toLowerCase());
            }
            return true;
        });
        setFilteredEvents(filtered);
    };

    return (
        <div className="main-page">
            <div className="container">
                <div className="search-container">
                    <Search
                        placeholder="Пошук за назвою, категорією або автором..." 
                        onSearch={handleSearch} 
                    />
                </div>


                <div className="events-list">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div key={event._id} className="event-card">
                                <h3>{event.name}</h3>
                                <p>
                                    <span className="material-icons">
                                        place
                                    </span>
                                    {event.place}
                                </p>
                                <p>
                                    <span className="material-icons">
                                        today
                                    </span>
                                    {new Date(event.date).toLocaleDateString()}</p>
                                <p>
                                    <span className="material-icons">
                                        schedule
                                    </span> 
                                    {event.time}
                                </p>
                                <p>
                                    <span className="material-icons">
                                        category
                                    </span>
                                    {event.category}
                                </p>
                                <p>
                                    <span className="material-icons">
                                        perm_identity
                                    </span>
                                    {event.userName}
                                </p>
                                <p>
                                    <span class="material-icons">
                                        description
                                    </span>
                                    {event.description}</p>
                                <div className="col events-buttons">
                                    <i className="material-icons grey-text">favorite</i>
                                    <i className="material-icons grey-text">directions_run</i>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Немає доступних подій.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
