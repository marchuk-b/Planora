import React from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import MainPage from './pages/MainPage/MainPage'
import AuthPage from './pages/AuthPage/AuthPage'



export const useRoutes = (isLogin) => {
    if(!isLogin) {
        return (
            <Routes>
                <Route path='/authpage/*' exact element={<AuthPage />} />
                <Route path='*' exact element={<Navigate to='/authpage/login' />} /> 
            </Routes>
        )
    }
    
    return (
        <Routes>
            <Route path='/' exact element={<MainPage />} />
            <Route path='*' exact element={<Navigate to='/' />} />
        </Routes>
    )
   
}