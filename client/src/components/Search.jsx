import React, { useState } from 'react';
import './Search.scss';

const Search = ({ placeholder, onSearch }) => {
    const [query, setQuery] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // Default to search by name

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value, searchBy);
    };

    const handleSearchByChange = (e) => {
        setSearchBy(e.target.value);
        onSearch(query, e.target.value);
    };

    return (
        <div className="search">
            <input 
                type="text" 
                id="search"
                placeholder={placeholder || "Search..."} 
                value={query} 
                onChange={handleQueryChange} 
                className="search-input" 
            />
            <select 
                value={searchBy} 
                onChange={handleSearchByChange} 
                className="search-select"
            >
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="userName">User</option>
            </select>
        </div>
    );
};

export default Search;
