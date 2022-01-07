import React, { useEffect, useState, PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useParams } from 'react-router-dom';
import styles from './PollGraph.module.css';


export interface options{
  answer: string
  counts: number
}

export interface PollGraph{
  id: number
  question: string
  options: options[]
}

const PollGraph = (props: any) => {
  const [poll, setPoll] = useState<PollGraph>({id: 0, question: "", options: []});
  const { id } = props;
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
    <h1 className={styles.question}>{poll["question"]}</h1>
    <BarChart
          width={700}
          height={500}
          data={poll.options}
         
        >
          <CartesianGrid strokeDasharray="1 3" />
          <XAxis dataKey="answer" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="counts" fill="#8884d8" />
        </BarChart>
  </div>
)}

export default PollGraph;

