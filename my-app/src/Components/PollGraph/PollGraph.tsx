import React, { useEffect, useState, PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { useParams } from 'react-router-dom';
import styles from './PollGraph.module.css';
import ScrollDialog from '../ScrollDialog/ScrollDialog';


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
  const [pickedAnswer, setPickedAnswer] = useState<string>("");
  const [empty, setEmpty] = useState<boolean>(true);
  const { id } = props;
  useEffect(() => {
    const params = {
      method: 'GET'
    }
    fetch(`http://localhost:5000/poll/${id}`, params)
      .then((res) => res.json())
      .then((data) => {
        let counts = 0;
        for(const answer of data["options"]){
          counts += answer["counts"]
        }
        setEmpty(counts == 0)
        setPoll(data)});
  }, [id]);
  
  function demoOnClick(e: any) {
    // alert(e["answer"]);
    // alert(window.location.href.split('/')[4])
    setPickedAnswer(e["answer"]);
  }

  return (
  <div className={styles.Poll}>
    <div className={styles.question}>
      <h1 style={{textAlign: 'center'}}>{poll["question"]}</h1>
      {empty ? (<div style={{textAlign: 'center'}}>No answers yet</div>) : (
        <h4>Create a Sub-Poll of the answer: 
          {pickedAnswer == "" ? "(click one of the bars)" : (<ScrollDialog answer={pickedAnswer} poll_id={window.location.href.split('/')[4]} title={"Create Sub-Poll of - "+poll["question"]+" - ("+pickedAnswer+")"} buttonText={pickedAnswer} actionType={"poll"} component={"poll"}/>)}
        </h4>
      )}
      
    </div>
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
          <Bar dataKey="counts" fill="#8884d8" onClick={demoOnClick} cursor="pointer"/>
        </BarChart>
  </div>
)}

export default PollGraph;

