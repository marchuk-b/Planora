import React from "react";
import "./AuthPage.scss";
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="container">
      <div className="auth-page">
        <h3>Авторизація</h3>
        <form className="form form-login">
          <div className="row">
            <div className="input-field col s12">
              <input type="email" name="email" className="validate" />
              <label htmlFor="email">Пошта</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input type="password" name="password" className="validate" />
              <label htmlFor="password">Пароль</label>
            </div>
          </div>
          <div className="row">
            <button className="waves-effect waves-light btn blue">
              Увійти
            </button>
            <Link to="/registration" className="btn-outline btn-reg">
              Немає акаунта ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const RegistrationPage = () => {
  return (
    <div className="container">
      <div className="auth-page">
        <h3>Реєстрація</h3>
        <form className="form form-login">
          <div className="row">
            <div className="input-field col s12">
              <input type="email" name="email" className="validate" />
              <label htmlFor="email">Пошта</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input type="password" name="password" className="validate" />
              <label htmlFor="password">Пароль</label>
            </div>
          </div>
          <div className="row">
            <button className="waves-effect waves-light btn blue">
              Реєстрація
            </button>
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
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
    </Routes>
  );
};

export default AuthPage;
