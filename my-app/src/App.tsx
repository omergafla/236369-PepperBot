import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './Components/Home/Home'
import Login from './Components/Auth/Login/Login'
import useToken from './Components/Auth/useToken'
import Poll from './Components/Poll/Poll';
import Polls from './Components/Polls/Polls';
import Admins from './Components/Admins/Admins';
import NotFound from './Components/NotFound/NotFound';

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <Router>
      <div className="App">
        {!token && token !== "" && token !== undefined ?
          <Login setToken={setToken} />
          : (
            <>
              <Routes>
                <Route path="/" element={<Home removeToken={removeToken} />}/>
                <Route path="/login" element={<Login setToken={setToken} />}></Route>
                <Route path="/polls/:id" element={<Poll removeToken={removeToken}/>} />
                <Route path="/polls" element={<Polls removeToken={removeToken}/>} />
                <Route path="/admins" element={<Admins removeToken={removeToken}/>} />
                <Route path="*" element={<NotFound removeToken={removeToken}/>} />
              </Routes>
            </>

          )}
      </div>
    </Router>
  );
}



export default App;
