import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import AddPollsForm from './components/AddPollsForm/AddPollsForm';
import Poll from './components/Poll/Poll'

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<AddPollsForm/>}/>
          <Route path="/poll/:id" element={<Poll/>}/>
        </Routes>
    </Router>
  );
}

export default App;
