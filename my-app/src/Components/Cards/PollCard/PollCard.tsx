import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from './PollCard.module.css'
import { useState } from 'react';


export default function PollCard(props: any) {
  const { label, poll_id, poll_question, loading } = props;
  const url = "http://localhost:3000/polls/"+poll_id
  return (
    <Card className={styles.PollCard} sx={{borderRadius: "16px"}} style={{ textAlign:'center' }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center">
          {label}
        </Typography>
        <div>
        {loading ? (<img src={require('../spinner.gif')} height="70px"></img>) : (<a href={url}> {poll_question} </a>)}
        </div>
      </CardContent>
    </Card>
  );
}

