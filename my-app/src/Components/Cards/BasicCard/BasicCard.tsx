import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from './BasicCard.module.css'
import { useState } from 'react';
import { style } from '@mui/system';


export default function BasicCard(props: any) {
  const { backColor, label, data, loading } = props;

  return (
    <div className={styles.BasicCard} style={{background: backColor}} >
      <div className={styles.wrap}>
        <div className={styles.label_settings}>
          {label}
        </div>
        <div className={styles.data_settings}>
          {loading ? (<img src={require('../spinner.gif')} height="70px"></img>) : data}
        </div>
      </div>
    </div>
  );
}
