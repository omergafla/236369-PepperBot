import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import AddPollsForm from './Components/Forms/AddPollsForm/AddPollsForm';
import Home from './Components/Home/Home'
import Header from './Components/Auth/Header/Header'
import Login from './Components/Auth/Login/Login'
import useToken from './Components/Auth/useToken'
import Poll from './Components/Poll/Poll';
import Polls from './Components/Polls/Polls';
import Admins from './Components/Admins/Admins';

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
                <Route path="/" element={<Home token={token} removeToken={removeToken} />}></Route>
                <Route path="/polls/:id" element={<Poll token={token} removeToken={removeToken}/>} />
                <Route path="/polls" element={<Polls token={token} removeToken={removeToken}/>} />
                <Route path="/admins" element={<Admins token={token} removeToken={removeToken}/>} />
              </Routes>
            </>
          )}
      </div>
    </Router>
  );
}


export default App;
