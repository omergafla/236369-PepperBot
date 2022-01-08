import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from './GraphCard.module.css'
import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function (props: any) {
  const { loading, label, xAxis, yAxis, data } = props;
  return (
  <div className={styles.GraphCard}>
      <div>
        <Typography variant="h6" component="div" align="center">
          {label}
        </Typography>
        <div>
        {loading ? (<img src={require('../spinner.gif')} height="70px"></img>) : 
        <ResponsiveContainer width="95%" height={300} className={styles.Container}>
          <BarChart className={styles.skewLeft}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          data={data}>
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis dataKey={xAxis} interval={0} angle={45} tick={{fontSize: 6}} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
        </BarChart>
        </ResponsiveContainer>
        }
        </div>
      </div>
    </div>
  )
}

