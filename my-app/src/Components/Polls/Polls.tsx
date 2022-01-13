import React, { useEffect, useState, PureComponent } from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridApi, GridCellValue } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import styles from './Polls.module.css';
import TopMenu from '../TopMenu/TopMenu';
import PollGraph from '../PollGraph/PollGraph';
import { Button } from '@mui/material';




// const rows: GridRowsProp = [
//   { id: 1, question: 'Hello', created_by: 'World', createt_at: '2022-01-07' },

// ];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'question', headerName: 'Question', width: 720, renderCell: (cellValues) => {
    const url = '/polls/'+cellValues.row["id"];
    return <a href={url}>{(cellValues.row["question"])}</a>;
  }},
  { field: 'answers', headerName: 'Answers', width: 100 },
  { field: 'parent', headerName: 'Parent', width: 100, renderCell: (cellValues) => {
    const url = '/polls/'+cellValues.row["parent"];
    return <a href={url}>{(cellValues.row["parent"])}</a>;
  }},
  { field: 'created_by', headerName: 'Created By', width: 150 },
  { field: 'created_at', headerName: 'Created At', width: 150 },
];

const Polls = (props: any) => {
  const [rows, setRows] = useState<GridRowsProp>([])
useEffect(() =>{
  // GET POLLS
  const params = {
    method: 'GET'
  }
  fetch(`http://localhost:5000/polls`, params)
    .then((res) => res.json())
    .then((data) => {
      setRows(data.result);
    });

},[]);
  return (
  <div className={styles.Poll}>
    <TopMenu removeToken={props.removeToken} token={props.token}/>
    <div className={styles.wrap}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  </div>
)}

export default Polls;

