import React, {useState} from "react";
import "./AuthPage.scss";
import { Route, Routes, Link } from "react-router-dom";
import axios from 'axios'

const LoginPage = ({ changeHandler, form}) => {
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
                        <button className="waves-effect waves-light btn blue">Увійти</button>
                        <Link to="/registration" className="btn-outline btn-reg">
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
                        <Link to="/login" className="btn-outline btn-reg">
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

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value});

    }

    const registerHandler = async () => {
        try {
            const response = await axios.post('/api/auth/registration', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Routes>
            <Route path="/login" element={
                <LoginPage 
                    changeHandler={changeHandler} 
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
