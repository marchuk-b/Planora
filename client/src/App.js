import './App.scss'

import Navbar from './components/Navbar'
import { useRoutes } from './routes'
import { AuthContext } from './context/AuthContext'
import { useAuth } from './hooks/auth.hook'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
    const {login, logout, token, userId, IsReady} = useAuth()
    const isLogin = !!token
    const routes = useRoutes(isLogin)

    return (
        <AuthContext.Provider value={{login, logout, token, userId, IsReady}}>
            <div className="App">
                <Navbar />
                { routes }

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </AuthContext.Provider>
    );
  }

export default App;
