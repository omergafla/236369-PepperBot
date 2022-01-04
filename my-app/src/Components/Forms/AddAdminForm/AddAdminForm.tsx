import React from 'react';
import styles from './AddAdminForm.module.css';
import TextField from '@mui/material/TextField';

const AddAdminForm = () => (
  <div className={styles.AddAdminForm}>
    <TextField className={styles.Margin} id="username" label="User Name" variant="outlined" autoComplete="current-password" />
    <TextField className={styles.Margin} id="password" label="Password" type="password" variant="outlined" autoComplete="current-password" />
    <TextField className={styles.Margin} id="repreat-password" label="Password" type="password" variant="outlined" autoComplete="current-password"/>
  </div>
);

export default AddAdminForm;
