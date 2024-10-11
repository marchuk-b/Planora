import React from 'react';

import "./MainPage.scss"

const MainPage = () => {
    return (
        <div className="container">
            <div className="main-page">
                <h4>Додати подію</h4>
                <form className="form form login">
                    <div className="row">
                        <div className="input-field col s12">
                            <input 
                                type="text" 
                                id="text"
                                name="input"
                                className="validate"
                            />
                            <label htmlFor="input">Подія: </label>
                        </div>
                    </div>
                    <div className="row">
                        <button className="waves-effect waves-light btn green">Додати</button>
                    </div>
                </form>

                <h3>Створені події</h3>
                <div className="events">
                    <div className="row flex events-item">
                        <div className="col events-num">1</div>
                        <div className="col events-text">Text</div>
                        <div className="col events-buttons">
                            <i className="material-icons blue-text">check</i>
                            <i className="material-icons orange-text">warning</i>
                            <i className="material-icons red-text">delete</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
