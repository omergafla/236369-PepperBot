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
    color: "white",
    backgroundColor: "#AAAA",
    marginRight: "2vh"
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="full-width">
      <AppBar position="sticky" style={{ background: "#2E3B55" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome Admin!
          </Typography>
          <div className="top-menu-buttons">
            <ScrollDialog title={"Create Your New Poll"} buttonText={"Create Poll"} actionType={"poll"} component={<AddPollsForm/>}/>
            <ScrollDialog title={"Add New Admin To The System"} buttonText={"Add Admin"} actionType={"admin"} component={<AddAdminForm/>}/>
            <Button style={buttonStyle} variant="contained" onClick={handleLogout}>Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}





export default TopMenu;
