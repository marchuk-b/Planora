import './App.scss'

import Navbar from './components/Navbar'
import { useRoutes } from './routes'
import { AuthContext } from './context/AuthContext'
import {useAuth} from './hooks/auth.hook'


function App() {
    const {login, logout, token, userId, IsReady} = useAuth()
    const isLogin = !!token
    const routes = useRoutes(isLogin)

    return (
        <AuthContext.Provider value={{login, logout, token, userId, IsReady}}>
            <div className="App">
            <Navbar />
            { routes }
            </div>
        </AuthContext.Provider>
    );
  }

export default App;
