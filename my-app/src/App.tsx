import React from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from '@mui/material/TextField'

function App() {
  return (
    <div className="App">
      <form id="create_poll_form">
      <input type="text" name="question"></input>
      <input type="text" name="answer"></input>
      <button>+</button>
      </form>
    </div>
  );
}

export default App;
