import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import AddPollsForm from './Components/Forms/AddPollsForm/AddPollsForm';
import Poll from './Components/Poll/Poll'
import Home from './Components/Home/Home'

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/poll/:id" element={<Poll/>}/>
        </Routes>
    </Router>
  );
}

export default App;
