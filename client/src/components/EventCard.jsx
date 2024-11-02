import React, { useState} from 'react';
import axios from 'axios';

const EventCard = ({ event, userId,  onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                // Unfollow request
                await axios.delete(`/api/events/unfollow/${event._id}`, {
                    data: { userId } // Pass userId in the request body if needed
                });
            } else {
                // Follow request
                await axios.post(`/api/events/follow/${event._id}`, { userId });
            }
            setIsFollowing(!isFollowing);
            onFollowChange();
        } catch (error) {
            console.error('Error following/unfollowing event:', error);
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
