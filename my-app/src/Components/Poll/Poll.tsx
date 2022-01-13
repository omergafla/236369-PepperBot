import React, { useEffect, useState, PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useParams } from 'react-router-dom';
import styles from './Poll.module.css';
import TopMenu from '../TopMenu/TopMenu';
import PollGraph from '../PollGraph/PollGraph';

const Poll = (props: any) => {
  const { id } = useParams();
  return (
  <div className={styles.Poll}>
    <TopMenu removeToken={props.removeToken} token={props.token}/>
    <PollGraph id={id} token={props.token}/>
  </div>
)}

export default Poll;

