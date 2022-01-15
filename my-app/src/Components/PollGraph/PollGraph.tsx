import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import styles from './PollGraph.module.css';
import ScrollDialog from '../ScrollDialog/ScrollDialog';
import NotFound from '../NotFound/NotFound';

export interface options {
  answer: string
  counts: number
}

export interface IPollGraph {
  id: number
  question: string
  options: options[]
}



const PollGraph = (props: any) => {
  const [poll, setPoll] = useState<IPollGraph>({ id: 0, question: "", options: [] });
  const [pickedAnswer, setPickedAnswer] = useState<string>("");
  const [empty, setEmpty] = useState<boolean>(true);
  const [next, setNext] = useState<number>();
  const [prev, setPrev] = useState<number>();
  const [exists, setExists] = useState<boolean>(true);
  let { id } = props;
  const params = {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': "*"
    }
  }

  const getPoll = () => {
    fetch(`http://localhost:5000/poll/${id}`, params)
      .then((res) => {
        if (res.status === 404) {
          setExists(false);
        }
        return res.json();
      })
      .then((data) => {
        let counts = 0;
        for (const answer of data["options"]) {
          counts += answer["counts"]
        }
        setEmpty(counts === 0)
        setPickedAnswer("")
        setPoll(data)
      });
  }

  const getSiblings = () => {
    fetch(`http://localhost:5000/poll/${id}/siblings`, params)
      .then((res) => res.json())
      .then((data) => {
        setNext(data["next"])
        setPrev(data["prev"])
      });
  }


  useEffect(getPoll, []);

  useEffect(getSiblings, []);

  function demoOnClick(e: any) {
    // alert(e["answer"]);
    // alert(window.location.href.split('/')[4])
    setPickedAnswer(e["answer"]);
  }

  function loadSibling(e: any) {
    if (e.currentTarget.lastElementChild.classList.value.includes("right")) {
      id = next;
    }
    else {
      if (e.currentTarget.lastElementChild.classList.value.includes("left")) {
        id = prev;
      }
      else {
        return;
      }
    }
    getPoll();
    getSiblings();
    window.history.pushState("", "polls/", id);
  }

  return (
    <div>
      {exists ? (
        <div className={styles.Poll}>
        <div className={styles.question}>
          <h1 style={{ textAlign: 'center' }}>
            {prev ? (
              <div onClick={loadSibling} style={{ left: "15%" }} className={styles.navigator}><FontAwesomeIcon icon={faArrowLeft} /> </div>
            ) : ""}

            {poll["question"]}
            {next ? (
              <div onClick={loadSibling} style={{ right: "15%" }} className={styles.navigator}><FontAwesomeIcon icon={faArrowRight} /> </div>
            ) : ""}
          </h1>
          {empty ? (<div style={{ textAlign: 'center' }}>No answers yet</div>) : (
            <h4>Create a Sub-Poll of the answer:
              {pickedAnswer === "" ? "(click one of the bars)" : (<ScrollDialog answer={pickedAnswer} poll_id={window.location.href.split('/')[4]} title={"Create Sub-Poll of - " + poll["question"] + " - (" + pickedAnswer + ")"} buttonText={pickedAnswer} actionType={"poll"} component={"poll"} token={props.token} />)}
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
          <Bar dataKey="counts" fill="#8884d8" onClick={demoOnClick} cursor="pointer" />
        </BarChart>
      </div>
      ) : (
        <NotFound />
      )}
      
    </div>

  )
}

export default PollGraph;

