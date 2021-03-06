import React, { useState } from 'react';
import styles from './AddAdminForm.module.css';
import TextField from '@mui/material/TextField';

const AddAdminForm = (props: any) => {

  const { setSignUpForm, error, setError } = props;

  function handleChange(event: any) {
    setError(false);
    const { value, id } = event.target
    setSignUpForm((prevNote: any) => ({
      ...prevNote, [id]: value
    })
    )
  }

  return (
    <div className={styles.AddAdminForm}>
      <TextField helperText={"Special characters (quotes) will be removed"} className={styles.Margin} id="username" label="User Name" variant="outlined" autoComplete="current-password" onChange={handleChange} />
      <TextField className={styles.Margin} id="password" label="Password" type="password" variant="outlined" autoComplete="current-password" onChange={handleChange} />
      <TextField className={styles.Margin} id="repeatPassword" label="Repeat Password" type="password" variant="outlined" autoComplete="current-password" error={error} onChange={handleChange} helperText={error ? "Passwords do not match.": ""} />
    </div>
  )
}



export default AddAdminForm;
