import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BasicCard from '../Cards/BasicCard/BasicCard';
import styles from './BasicGrid.module.css'
import { useState } from 'react';

export interface loaders{
  [key: string]: boolean;
}

export default function BasicGrid(props: any) {
  const init_loaders = {
    users: true,
    active_users: true,
    polls: true,
    today_polls: true,
    admins: true,
    active_users_today: true,
    popular_poll: true,
    newest_poll: true,
    daily_users: true,
    daily_polls: true,
    active_users_ratio: true,
    most_answered_polls: true,
    admins_compare: true,
    most_clear: true,
    unclear: true
  }

  const [loaders, setLoaders] = useState<loaders>(init_loaders)
  const { size } = props;
  return (
    <div className={styles.dashboard}>
        <div className={styles.div1}> <BasicCard loading={loaders.users} data={"89"} label={"Users"} /> </div>
        <div className={styles.div2}> <BasicCard loading={loaders.active_users} data={"80"} label={"Active Users"} /></div>
        <div className={styles.div3}> <BasicCard loading={loaders.polls} data={"29"} label={"Polls"} /></div>
        <div className={styles.div4}> <BasicCard loading={loaders.today_polls} data={"4"} label={"New Polls Today"} /></div>
        <div className={styles.div5}> <BasicCard loading={loaders.admins} data={"3"} label={"Admins"} /></div>
        <div className={styles.div6}> <BasicCard loading={loaders.active_users_today} data={"70"} label={"Active Users Today"} /></div>
        <div className={styles.div7}> <BasicCard loading={loaders.popular_poll} data={"#23 How are you?"}  label={"Most Popular Poll"}/></div>
        <div className={styles.div8}> <BasicCard loading={loaders.newest_poll} data={"#45 Where is the best pizza in Haifa?"} label={"Newest Poll"} /></div>
        <div className={styles.div9}> <BasicCard loading={loaders.daily_users} data={"#45 Where is the best pizza in Haifa?"}  label={"New Users per Day"}/></div>
        <div className={styles.div10}> <BasicCard loading={loaders.daily_polls} data={"#45 Where is the best pizza in Haifa?"}  label={"New Polls per Day"}/></div>
        <div className={styles.div11}> <BasicCard loading={loaders.active_users_ratio} data={"#45 Where is the best pizza in Haifa?"} label={"Active Users Ratio"}/>  </div>
        <div className={styles.div12}> <BasicCard loading={loaders.most_answered_polls} data={"#45 Where is the best pizza in Haifa?"} label={"Most Popular Polls"}/> </div>
        <div className={styles.div13}> <BasicCard loading={loaders.admins_compare} data={"#45 Where is the best pizza in Haifa?"} label={"Admins Activity"}/> </div>
        <div className={styles.div14}> <BasicCard loading={loaders.most_clear} data={"#45 Where is the best pizza in Haifa?"} label={"Easiest Decision"}/> </div>
    </div>
  );
}