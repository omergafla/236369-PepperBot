import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from './BasicCard.module.css'
import { useState } from 'react';


export default function BasicCard(props: any) {
  const { label, data, loading } = props;

  return (
    <Card className={styles.BasicCard} sx={{borderRadius: "16px"}}>
      <CardContent>
        <Typography variant="h6" component="div" align="center">
          {label}
        </Typography>
        <Typography variant="h5" component="div" align="center" gutterBottom>
          {loading ? (<img src={require('./spinner.gif')} height="70px"></img>) : data}
        </Typography>
      </CardContent>
    </Card>
  );
}
