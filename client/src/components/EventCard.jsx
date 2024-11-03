import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventCard = ({ event, userId, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    // Check if the user is following the event when the component mounts
    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                // Fetch the user's followed events to check if this event is followed
                const response = await axios.get(`/api/users/${userId}`);
                const user = response.data; // Assuming this returns the user object

                // Check if the followedEvents array contains the event ID
                setIsFollowing(user.followedEvents.includes(event._id));
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            }
        };

        // Only call if userId and event._id are defined
        if (userId && event && event._id) {
            checkFollowingStatus();
        }
    }, [userId, event]); // Add dependencies to ensure it runs when userId or event changes

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                // Unfollow request
                await axios.delete(`/api/events/unfollow/${event._id}`, {
                    data: { userId }
                });
            } else {
                // Follow request
                await axios.post(`/api/events/follow/${event._id}`, {
                    userId // Ensure this is structured correctly for your backend
                });
            }
            setIsFollowing(!isFollowing);
            onFollowChange(); // Call to update any parent component state
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
                    className="material-icons" 
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
