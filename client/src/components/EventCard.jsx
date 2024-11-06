import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./EventCard.scss";

const EventCard = ({ event, userId, onFollowChange, onPresentChange, followedEventsIds, presentEventsIds }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isPresent, setIsPresent] = useState(false);

    useEffect(() => {
        const checkFollowingStatus = () => {
            try {
                if (Array.isArray(followedEventsIds) && followedEventsIds.length > 0) {
                    const isEventFollowed = followedEventsIds.some(followedEvent => followedEvent._id === event._id);
                    setIsFollowing(isEventFollowed);
                    localStorage.setItem(`isFollowing-${event._id}`, JSON.stringify(isEventFollowed));
                } else {
                    setIsFollowing(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            }
        };

        const checkPresentStatus = () => {
            try {
                if (Array.isArray(presentEventsIds) && presentEventsIds.length > 0) {
                    const isEventPresent = presentEventsIds.some(presentEvent => presentEvent._id === event._id);
                    setIsPresent(isEventPresent);
                    localStorage.setItem(`isPresent-${event._id}`, JSON.stringify(isEventPresent));
                } else {
                    setIsPresent(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            }
        };
    
        if (userId && event && event._id) {
            // Перевіряємо збережений стан у localStorage
            const savedStatusFollowed = localStorage.getItem(`isFollowing-${event._id}`);
            if (savedStatusFollowed !== null) {
                setIsFollowing(JSON.parse(savedStatusFollowed));
            } else {
                checkFollowingStatus();
            }

            const savedStatusPresent = localStorage.getItem(`isPresent-${event._id}`);
            if (savedStatusPresent !== null) {
                setIsPresent(JSON.parse(savedStatusPresent));
            } else {
                checkPresentStatus();
            }
        }
    }, [userId, event, followedEventsIds, presentEventsIds]);
    

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await axios.delete(`/api/events/unfollow/${event._id}`, {
                    data: { userId }
                });
                localStorage.setItem(`isFollowing-${event._id}`, JSON.stringify(false));
            } else {
                await axios.post(`/api/events/follow/${event._id}`, {
                    userId
                });
                localStorage.setItem(`isFollowing-${event._id}`, JSON.stringify(true));
            }
            setIsFollowing(!isFollowing);
            onFollowChange();
        } catch (error) {
            console.error('Error following/unfollowing event:', error.response ? error.response.data : error.message);
        }
    };

    const handlePresent = async () => {
        try {
            if (isPresent) {
                await axios.delete(`/api/events/unpresent/${event._id}`, {
                    data: { userId }
                });
                localStorage.setItem(`isPresent-${event._id}`, JSON.stringify(false));
            } else {
                await axios.post(`/api/events/present/${event._id}`, {
                    userId
                });
                localStorage.setItem(`isPresent-${event._id}`, JSON.stringify(true));
            }
            setIsPresent(!isPresent);
            onPresentChange();
        } catch (error) {
            console.error('Error present/unpresent event:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div key={event._id} className="event-card">
            <h3>{event.name}</h3>
            <p>
                <span className="material-icons">place</span>
                {event.place}
            </p>
            <p>
                <span className="material-icons">today</span>
                {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
                <span className="material-icons">schedule</span> 
                {event.time}
            </p>
            <p>
                <span className="material-icons">category</span>
                {event.category}
            </p>
            <p>
                <span className="material-icons">perm_identity</span>
                {event.userName}
            </p>
            <p>
                <span className="material-icons">description</span>
                {event.description}
            </p>

            <div className="col events-buttons">
                <i 
                    className="material-icons red-text" 
                    onClick={handleFollow}
                    role="button" 
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                >
                    {isFollowing ? 'favorite' : 'favorite_border'}
                </i>
                <i 
                    className="material-icons blue-text" 
                    onClick={handlePresent}
                    role="button" 
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                >
                    {isPresent ? 'how_to_reg' : 'person'}
                </i>
            </div>
        </div>
    );
};

export default EventCard;
