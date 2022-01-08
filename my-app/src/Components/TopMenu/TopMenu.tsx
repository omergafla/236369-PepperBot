import React, { useState } from 'react';
import './TopMenu.css';
import Button from '@mui/material/Button';
import ScrollDialog from '../ScrollDialog/ScrollDialog';
import AddPollsForm from '../Forms/AddPollsForm/AddPollsForm';
import AddAdminForm from '../Forms/AddAdminForm/AddAdminForm';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";


const TopMenu = () => {

  const handleLogout = () => {
    //redirect to login page and somehow restart session? 
  }

  const buttonStyle = {
    color: "#8884d8",
    backgroundColor: "white",
    marginRight: "2vh"
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="full-width">
      <AppBar position="sticky" style={{ background: "#8884d8" }}>
        <Toolbar>
          <a href="/"><img className="pepper" src={require('./pepper.jpeg')} height="40px"></img></a>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome Admin!
          </Typography>
          <div className="top-menu-buttons">
            <a href="/polls"><Button style={buttonStyle} variant="contained">Polls</Button></a>
            <ScrollDialog title={"Create Your New Poll"} buttonText={"Create Poll"} actionType={"poll"} component={"poll"}/>
            <ScrollDialog title={"Add New Admin To The System"} buttonText={"Add Admin"} actionType={"admin"} component={"admin"}/>
            <Button style={buttonStyle} variant="contained" onClick={handleLogout}>Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}





export default TopMenu;
