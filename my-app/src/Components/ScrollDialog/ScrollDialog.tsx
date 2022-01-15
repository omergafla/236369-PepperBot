import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import AddPollsForm from '../Forms/AddPollsForm/AddPollsForm';
import AddAdminForm from '../Forms/AddAdminForm/AddAdminForm';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import './ScrollDialog.css'

export default function ScrollDialog(props: any) {
  const { title, buttonText, actionType, poll_id, answer, username, token } = props;
  const [open, setOpen] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [severity, setSeverity] = useState("success" as AlertColor);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);


  const [inputFields, setInputFields] = useState([
    { id: Math.random(), option: '' },
    { id: Math.random(), option: '' }
  ]);
  const [question, setQuestion] = useState("")

  const [signUpForm, setSignUpForm] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  })

  function validateForm(action: string) {
    const res = action === "admin" ?
      signUpForm.username.length > 0 && signUpForm.password.length > 0 :
      question.length > 0 && inputFields[0].option.length > 0 && inputFields[1].option.length > 0;
    const res2 = signUpForm.username.length < 50;
    if (!res) {
      setSeverity("error");
      setMsg("Fields cannot be empty! Please fill all fields to proceed");
      setOpenSnackBar(true);
    }
    if (!res2) {
      setSeverity("error");
      setMsg("Username cannot be greater than 50 characters");
      setOpenSnackBar(true);
    }
    return res && res2;
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const getParams = (result: any) => {
    return {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify(result)
    }

  }

  const setSeverityAndMsgForPoll = (status: number) => {
    switch (status) {
      case 200:
        setSeverity("success");
        setMsg("Poll added and sent to the users succefuly! Stay tuned for results...")
        break;
      case 503:
        setSeverity("error");
        setMsg("No active users, poll not sent.")
        break;
      default:
        setSeverity("error");
        setMsg("Whoops! Something has gone wrong.")
    }
    setOpenSnackBar(true);
    setOpen(false);
    setQuestion("");
    setInputFields([
      { id: Math.random(), option: '' },
      { id: Math.random(), option: '' }
    ])
  }

  const handleAdmin = () => {
    if (signUpForm.password !== signUpForm.repeatPassword) {
      setError(true);
      return;
    }
    const result = { 'username': signUpForm.username, 'password': signUpForm.password }
    const params = getParams(result);
    fetch("http://localhost:5000/add_admin", params)
      .then((response) => {
        let msg;
        switch (response.status) {
          case 200:
            setSeverity("success");
            msg = signUpForm.username + " was added as an admin succefully!"
            setMsg(msg);
            break;
          case 409:
            setSeverity("error");
            msg = "Uh oh! An admin by the name " + signUpForm.username + " already exists, please try a different name."
            setMsg(msg);
            break;
          default:
            setSeverity("error");
            setMsg("No need to panic, but something has gone wrong.")
        }
        setOpenSnackBar(true);
        setOpen(false);
      })
  }

  const handleSubmit = () => {
    if (!validateForm(actionType)) {
      return;
    }
    if (actionType === "admin") {
      handleAdmin();
    }
    if (actionType === "poll") {
      if (poll_id && answer) {
        const result = { 'question': question, 'answers': inputFields, 'poll_id': poll_id, 'answer': answer }
        const params = getParams(result);
        fetch("http://localhost:5000/add_sub_poll", params)
          .then((response) => {
            setSeverityAndMsgForPoll(response.status);
          })
      }
      else {
        const result = { 'question': question, 'answers': inputFields }
        const params = getParams(result);
        fetch("http://localhost:5000/add_poll", params)
          .then((response) => {
            setSeverityAndMsgForPoll(response.status);
          })
      }
      
    }
  };


  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const buttonStyle = {
    marginRight: "1.5vh",
    background: "transparent",
    color: "white",
    boxShadow: "none"
  };
  const subPollButtonStyle = {
    marginRight: "1.5vh",
    background: "white",
    color: "#8884d8",

  };

  return (
    <div>
      {poll_id ? (
        <Button className={"btn"} style={subPollButtonStyle} variant="contained" onClick={handleOpen}>{buttonText}</Button>
      ) : (
        <Button className={"btn"} style={buttonStyle} variant="contained" onClick={handleOpen}>{buttonText}</Button>
      )}
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {actionType === "poll" ? (<AddPollsForm question={question} inputFields={inputFields} setQuestion={setQuestion} setInputFields={setInputFields} poll_id={poll_id} answer={answer} />)
              : (<AddAdminForm setSignUpForm={setSignUpForm} error={error} setError={setError} />)
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert variant="filled" onClose={handleCloseSnackBar} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
