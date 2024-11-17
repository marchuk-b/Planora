import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './MainPage.scss';
import Search from '../../components/Search';
import {AuthContext} from '../../context/AuthContext'
import EventCard from '../../components/EventCard';
const { ToastContainer } = require('react-toastify');

const MainPage = () => {
    const {userId} = useContext(AuthContext)
    const [events, setEvents] = useState([]); // State to store all events
    const [filteredEvents, setFilteredEvents] = useState([]); // Events after filtering
    const [followedEventsIds, setFollowedEventsIds] = useState([]); // State to store followed events
    const [presentEventsIds, setPresentEventsIds] = useState([]); // State to store present events

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

    useEffect(() => {
        const fetchFollowed = async () => {
            try {
                const response = await axios.get(`/api/events/followed/${userId}`, {
                    headers: { "Content-Type": "application/json" }
                });

                const followedEventsIds = response.data;
                setFollowedEventsIds(followedEventsIds);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        const fetchPresent = async () => {
            try {
                const response = await axios.get(`/api/events/presented/${userId}`, {
                    headers: { "Content-Type": "application/json" }
                });

                const presentEventsIds = response.data;
                setPresentEventsIds(presentEventsIds);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchFollowed();
        fetchPresent();
    }, [userId]);

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
                            <EventCard key={event._id} event={event} userId={userId} 
                            followedEventsIds={followedEventsIds} presentEventsIds={presentEventsIds}
                            onFollowChange={() => {}} onPresentChange={() => {}} />
                        ))
                    ) : (
                        <p>Немає доступних подій.</p>
                    )}
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default MainPage;
