import React, { useContext, useState, useEffect } from "react";
import "./Navbar.scss";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";  // Make sure axios is imported

const Navbar = () => {
    const { logout, token, userId } = useContext(AuthContext);
    const [userEmail, setEmail] = useState(""); 
    const isLogin = !!token;

    useEffect(() => {
        const getEmail = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`, {
                    headers: { "Content-Type": "application/json" }
                });

                const userEmail = response.data.email;
                setEmail(userEmail); 
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (userId) {
            getEmail();
        }
    }, [userId]);  // Only run the effect if userId changes

    return (
        <nav>
            <div className="nav-wrapper navbar green">
                <a href="/" className="brand-logo">Planora</a>

                {/* <div className="center-links">
                    {isLogin && <Link to="/" className="link">Головна</Link>}
                    {isLogin && <Link to="/create" className="link">Створити подію</Link>}
                    {isLogin && <Link to="/myevents" className="link">Мої події</Link>}
                </div> */}
                
                <div className="right-links">
                    {isLogin ? (
                        <div className="user-info">
                            <span className="material-icons">
                                account_circle
                            </span>
                            <div className="username">{userEmail}</div>

                            {/* Dropdown Menu */}
                            <div className="dropdown-menu">
                                <Link to="/">Головна</Link>
                                <Link to="/create" className="link">Створити подію</Link>
                                <Link to="/myevents">Мої події</Link>
                                <Link to="/" onClick={logout}>Вийти</Link>
                            </div>
                            <span className="material-icons">
                                expand_more 
                            </span>
                        </div>
                    ) : (
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li>
                                <Link to="/login">Увійти</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;