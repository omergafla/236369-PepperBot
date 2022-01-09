import React from 'react';
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

function App() {
  const { token, removeToken, setToken } = useToken();
  return (
    // <Router>
    //     <Routes>
    //       <Route path="/" element={<Home/>}/>
    //       <Route path="/poll/:id" element={<Poll/>}/>
    //     </Routes>
    // </Router>
    <Router>
      <div className="App">
        {/* <Header removeToken={removeToken} /> */}
        {!token && token !== "" && token !== undefined ?
          <Login setToken={setToken} />
          : (
            <>
              <Routes>
                <Route path="/" element={<Home token={token} removeToken={removeToken}/>}></Route>
                <Route path="/polls/:id" element={<Poll/>}/>
                <Route path="/polls" element={<Polls/>}/>
              </Routes>
            </>
          )}
      </div>
    </Router>
  );
}


export default App;
