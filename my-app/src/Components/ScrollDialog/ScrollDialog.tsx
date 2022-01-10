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

export default function ScrollDialog(props: any) {
  const { title, buttonText, actionType, poll_id, answer } = props;
  const [open, setOpen] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [severity, setSeverity] = useState("success" as AlertColor);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  const [inputFields, setInputFields] = useState([
    { id: Math.random(), option: '' },
  ]);
  const [question, setQuestion] = useState("")

  const [signUpForm, setSignUpForm] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  })


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };
  

  const handleSubmit = () => {
    if (actionType === "admin") {
      if (signUpForm.password !== signUpForm.repeatPassword){
        setError(true);
        setSeverity("error");
        setOpen(false);
        return;
      }
      const result = {'username': signUpForm.username, 'password': signUpForm.password} 
      const params = {
        method: 'POST',
        body: JSON.stringify(result)
      }
      fetch("http://localhost:5000/add_admin", params)
      .then((response)=>
      {
        if(response.ok){
          setSeverity("success");
        }
      })
    }
    if (actionType === "poll") {
      if(poll_id && answer){
      const result = {'question': question, 'answers': inputFields, 'poll_id': poll_id, 'answer':answer} 
      const params = {
        method: 'POST',
        body: JSON.stringify(result)
      }
      fetch("http://localhost:5000/add_sub_poll", params)
      }
      else{
        const result = {'question': question, 'answers': inputFields} 
        const params = {
          method: 'POST',
          body: JSON.stringify(result)
        }
        fetch("http://localhost:5000/add_poll", params)
      }
    }
    setOpen(false);
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
    color: "#8884d8",
    backgroundColor: "#FFF",
    marginRight: "2vh"
  };

  return (
    <div>
      <Button variant="contained" style={buttonStyle} onClick={handleOpen}>{buttonText}</Button>
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
            {actionType === "poll" ? (<AddPollsForm question={question} inputFields={inputFields} setQuestion={setQuestion} setInputFields={setInputFields} poll_id={poll_id} answer={answer}/>) 
            : (<AddAdminForm setSignUpForm={setSignUpForm} error={error} setError={setError}/>)
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
