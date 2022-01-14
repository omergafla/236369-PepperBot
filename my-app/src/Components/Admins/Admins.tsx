import React, { useEffect, useState, PureComponent } from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridApi, GridCellValue } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import styles from './Admins.module.css';
import TopMenu from '../TopMenu/TopMenu';
import { Button } from '@mui/material';




// const rows: GridRowsProp = [
//   { id: 1, question: 'Hello', created_by: 'World', createt_at: '2022-01-07' },

// ];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100, align: 'center', headerAlign: 'center', },
  { field: 'username', headerName: 'Username', width: 250, align: 'center', headerAlign: 'center', },
  { field: 'polls', headerName: 'Polls Sent', width: 150, align: 'center', headerAlign: 'center', },
];

const Admins = (props: any) => {
  const [rows, setRows] = useState<GridRowsProp>([])
  useEffect(() => {
    // GET POLLS
    const params = {
      method: 'GET'
    }
    fetch(`http://localhost:5000/admins`, params)
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
      });
  }, []);

  return (
    <div className={styles.Admins}>
      <TopMenu removeToken={props.removeToken} />
      <div className={styles.wrap}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  )
}

export default Admins;

