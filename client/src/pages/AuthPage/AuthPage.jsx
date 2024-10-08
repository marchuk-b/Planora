import React, {useState, useContext} from "react";
import "./AuthPage.scss";
import { Route, Routes, Link } from "react-router-dom";
import axios from 'axios'
import { AuthContext } from "../../context/AuthContext";

const LoginPage = ({ changeHandler, loginHandler, form}) => {
    return (
        <div className="container">
            <div className="auth-page">
                <h3>Авторизація</h3>
                <form className="form form-login" onSubmit={e => e.preventDefault()} > 
                    <div className="row">
                        <div className="input-field col s12">
                            <input type="email" name="email" className="validate" onChange={changeHandler} value={form.email} />
                            <label htmlFor="email">Пошта</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                        <input type="password" name="password" className="validate" onChange={changeHandler} value={form.password} />
                        <label htmlFor="password">Пароль</label>
                        </div>
                    </div>
                    <div className="row">
                        <button className="waves-effect waves-light btn blue" onClick={loginHandler} >Увійти</button>
                        <Link to="/authpage/registration" className="btn-outline btn-reg">
                            Немає акаунта ?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RegistrationPage = ({ changeHandler, registerHandler, form }) => {
    return (
        <div className="container">
            <div className="auth-page">
                <h3>Реєстрація</h3>
                <form className="form form-login" onSubmit={e => e.preventDefault()} >
                    <div className="row">
                        <div className="input-field col s12">
                            <input type="email" name="email" className="validate" onChange={changeHandler} value={form.email} />
                            <label htmlFor="email">Пошта</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input type="password" name="password" className="validate" onChange={changeHandler} value={form.password}/>
                            <label htmlFor="password">Пароль</label>
                        </div>
                    </div>
                    <div className="row">
                        <button className="waves-effect waves-light btn blue" onClick={registerHandler} >Реєстрація</button>
                        <Link to="/authpage/login" className="btn-outline btn-reg">
                            Уже маєте акаунт?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AuthPage = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const {login} = useContext(AuthContext)

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value});
    }

    const registerHandler = async () => {
        try {
            await axios.post('/api/auth/registration', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => console.log(response))
        } catch (error) {
            console.log(error)
        }
    }

    const loginHandler = async () => {
        try {
            await axios.post('/api/auth/login', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                login(response.data.token, response.data.userId)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Routes>
            <Route path="/login" element={
                <LoginPage 
                    changeHandler={changeHandler}
                    loginHandler={loginHandler} 
                    form={form} 
                />} 
            />
            <Route path="/registration" element={
                <RegistrationPage 
                    changeHandler={changeHandler} 
                    registerHandler={registerHandler} 
                    form={form} 
                />} 
            />
        </Routes>
    );
};

export default AuthPage;
