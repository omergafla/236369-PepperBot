import { useState, useEffect } from 'react';
import styles from './Login.module.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';


function Login(props: any) {
  
  const { setToken } = props;
  const [loginForm, setloginForm] = useState({
    username: "",
    password: ""
  })

  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    window.history.replaceState("", "", "/login");
  }, []);

  function validateForm() {
    return loginForm.username.length > 0 && loginForm.password.length > 0;
  }

  function logMeIn(event: any) {
    if (validateForm() === false) {
      setError(true);
      setMsg("Username or password can't be empty");
      setOpen(true);
      return;
    }
    const data = {
      username: loginForm.username,
      password: loginForm.password
    }
    fetch("http://localhost:5000/token", {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.status === 200)
          return response.json()
        else if (response.status === 401) {
          setOpen(true);
          setError(true);
          setMsg("Username or password is inccorect, please try again");
          return;
        }
      }).then((data) => {
        setToken(data.access_token);
        setloginForm(({
          username: "",
          password: ""
        }))
        window.location.href = "http://localhost:3000/";
      }).catch((error) => {
        // Do somethong else here!
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })


    event.preventDefault()
  }

  function handleChange(event: any) {
    setError(false);
    const { value, id } = event.target
    setloginForm(prevNote => ({
      ...prevNote, [id]: value
    })
    )
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div className={styles.Login}>
      <span data-tooltip="Hey! I'm Pepper, Enter credentials please, woof!" data-flow="right">
        <img className="pepper" src={require('./pepper.jpeg')} height="80px"></img></span>
      <Box className={styles.box}>
        <TextField className={styles.Margin} id="username" label="User Name" variant="outlined" autoComplete="current-password" error={error} onChange={handleChange} />
        <TextField className={styles.Margin} id="password" label="Password" type="password" variant="outlined" autoComplete="current-password" error={error} onChange={handleChange} />
        <Button onClick={logMeIn} variant="contained">Login</Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert variant="filled" onClose={handleClose} severity={"error"} sx={{ width: '100%' }}>
            {msg}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );

}

export default Login;
