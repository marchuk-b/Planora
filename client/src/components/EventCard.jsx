import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./EventCard.scss";

const EventCard = ({ event, userId, onFollowChange, followedEventsIds }) => {
    const [isFollowing, setIsFollowing] = useState(false);

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
    
        if (userId && event && event._id) {
            // Перевіряємо збережений стан у localStorage
            const savedStatus = localStorage.getItem(`isFollowing-${event._id}`);
            if (savedStatus !== null) {
                setIsFollowing(JSON.parse(savedStatus));
            } else {
                checkFollowingStatus();
            }
        }
    }, [userId, event, followedEventsIds]);
    

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
                <i className="material-icons grey-text">directions_run</i>
            </div>
        </div>
    );
};

export default EventCard;
