import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from './BasicCard.module.css'
import { useState } from 'react';


export default function BasicCard(props: any) {
  const { label, data } = props;
  return (
    <Card className={styles.BasicCard} sx={{borderRadius: "16px"}}>
      <CardContent>
        <Typography variant="h5" component="div" align="center" gutterBottom>
          {data}
        </Typography>
        <Typography variant="h5" component="div" align="center">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}
