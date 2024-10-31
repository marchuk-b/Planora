import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.scss';
import Search from '../../components/Search';

const MainPage = () => {
    const [events, setEvents] = useState([]); // State to store all events
    const [filteredEvents, setFilteredEvents] = useState([]); // Events after filtering


    // Fetch all events
    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                const response = await axios.get('/api/events/all', {
                    headers: { "Content-Type": "application/json" }
                });
                const eventsWithUsernames = response.data.map(event => ({
                    ...event,
                    userName: event.user?.email.split('@')[0] || "невідомий" // Get user name
                }));
                setEvents(eventsWithUsernames);
                setFilteredEvents(eventsWithUsernames); // Initially, display all events
            } catch (error) {
                console.error("Помилка при завантаженні подій:", error);
            }
        };

        fetchAllEvents();
    }, []);

    function getUsernameFromEmail(email) {
        if (!email || typeof email !== 'string') return '';
    
        return email.substring(0, email.indexOf('@'));
    }

    // Handle search query and filter events
    const handleSearch = (query, searchBy) => {
        const lowerCaseQuery = query.toLowerCase();

        const filtered = events.filter(event =>
            event[searchBy].toLowerCase().includes(lowerCaseQuery)
        );

        setFilteredEvents(filtered); // Update the displayed events based on search query and criterion
    };

    return (
        <div className="main-page">
            <div className="container">
                    <Search
                        placeholder="Пошук за назвою, категорією або автором..." 
                        onSearch={handleSearch} 
                    />

                <div className="events-list">
                     {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div key={event._id} className="event-card">
                            <h3>{event.name}</h3>
                            <p><strong>Місце:</strong> {event.place}</p>
                            <p><strong>Дата:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Час:</strong> {event.time}</p>
                            <p><strong>Опис:</strong> {event.description}</p>
                            <p><strong>Категорія:</strong> {event.category}</p>
                            <p><strong>Автор:</strong> {getUsernameFromEmail(event.owner?.email)}</p>
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
