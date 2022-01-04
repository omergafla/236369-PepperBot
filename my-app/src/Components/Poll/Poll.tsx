import React, { useEffect, useState, PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useParams } from 'react-router-dom';
import styles from './Poll.module.css';


export interface options{
  answer: string
  counts: number
}

export interface Poll{
  id: number
  question: string
  options: options[]
}

const Poll = () => {
  const [poll, setPoll] = useState<Poll>({id: 0, question: "", options: []});
  const { id } = useParams();
  useEffect(() => {
    const params = {
      method: 'GET'
    }
    fetch(`http://localhost:5000/poll/${id}`, params)
      .then((res) => res.json())
      .then((data) => setPoll(data));
  }, [id]);
  

  return (
  <div className={styles.Poll}>
    <h1>{poll["question"]}</h1>
    <BarChart
          width={500}
          height={300}
          data={poll.options}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="answer" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="counts" fill="#8884d8" />
        </BarChart>
  </div>
)}

export default Poll;

