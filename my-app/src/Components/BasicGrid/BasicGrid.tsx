import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BasicCard from '../Cards/BasicCard/BasicCard';
import styles from './BasicGrid.module.css'


export default function BasicGrid(props: any) {
  const { size } = props;
  return (
    <div className={styles.dashboard}>
        <div className={styles.div1}> <BasicCard data={"89"} label={"Users"} /> </div>
        <div className={styles.div2}> <BasicCard data={"80"} label={"Active Users"} /></div>
        <div className={styles.div3}> <BasicCard data={"29"} label={"Polls"} /></div>
        <div className={styles.div4}> <BasicCard data={"4"} label={"New Polls Today"} /></div>
        <div className={styles.div5}> <BasicCard data={"3"} label={"Admins"} /></div>
        <div className={styles.div6}> <BasicCard data={"70"} label={"Active Users Today"} /></div>
        <div className={styles.div7}> <BasicCard data={"#23 How are you?"} /></div>
        <div className={styles.div8}> <BasicCard data={"#45 Where is the best pizza in Haifa?"} /></div>
        <div className={styles.div9}> <BasicCard data={"#45 Where is the best pizza in Haifa?"} /></div>
        <div className={styles.div10}> <BasicCard data={"#45 Where is the best pizza in Haifa?"} /> </div>
        <div className={styles.div11}> <BasicCard data={"#45 Where is the best pizza in Haifa?"} /> </div>
        <div className={styles.div12}> <BasicCard data={"#45 Where is the best pizza in Haifa?"} /> </div>
        <div className={styles.div13}> <BasicCard data={"#45 Where is the best pizza in Haifa?"} /> </div>
        <div className={styles.div14}> <BasicCard data={"#45 Where is the best pizza in Haifa?"} /> </div>
    </div>
  );
}