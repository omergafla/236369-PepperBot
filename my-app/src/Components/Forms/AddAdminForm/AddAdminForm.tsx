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
      <TextField className={styles.Margin} id="username" label="User Name" variant="outlined" autoComplete="current-password" error={error} onChange={handleChange} />
      <TextField className={styles.Margin} id="password" label="Password" type="password" variant="outlined" autoComplete="current-password" error={error} onChange={handleChange} />
      <TextField className={styles.Margin} id="repeat-password" label="Repeat Password" type="password" variant="outlined" autoComplete="current-password" error={error} onChange={handleChange} />
    </div>
  )
}



export default AddAdminForm;
