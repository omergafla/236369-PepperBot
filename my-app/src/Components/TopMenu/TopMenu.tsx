import React, { useEffect, useState } from 'react';
import './TopMenu.css';
import Button from '@mui/material/Button';
import ScrollDialog from '../ScrollDialog/ScrollDialog';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";


const TopMenu = (props: any) => {

  const handleLogout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
    })
      .then(() => {
        props.removeToken();
        window.location.href = "http://localhost:3000/login";
      })
  }


  const [username, setUsername] = useState("Admin");
  
  const getUsername = () => {
    fetch("http://localhost:5000/username", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': "*"
      }
    })
      .then(res => { return res.json() })
      .then((data) => {
        if(data && data["msg"] && data["msg"]=='Token has expired'){
          window.location.href = "http://localhost:3000/login";
        }
        const username = data.username;
        const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
        setUsername(capitalizedUsername);
      })
  }
  
  useEffect( getUsername, []);
  

  const buttonStyle = {
    marginRight: "1.5vh",
    background: "transparent",
    color: "white",
    boxShadow: "none"
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="full-width">
      <AppBar position="sticky" style={{ background: "#8884d8" }}>
        <Toolbar>
          <a href="/"><img className="pepper" src={require('./pepper.jpeg')} height="40px"></img></a>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome {username}!
          </Typography>
          <div className="top-menu-buttons">
            <a href="/admins"><Button className={"hoverbold"} style={buttonStyle} variant="contained">Admins</Button></a>
            <a href="/polls"><Button className={"hoverbold"} style={buttonStyle} variant="contained">Polls</Button></a>
            <ScrollDialog username={username} title={"Create Your New Poll"} buttonText={"Create Poll"} actionType={"poll"} />
            <ScrollDialog title={"Add New Admin To The System"} buttonText={"Add Admin"} actionType={"admin"} />
            <Button className={"hoverbold"} style={buttonStyle} variant="contained" onClick={handleLogout}>Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}





export default TopMenu;
