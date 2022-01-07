import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BasicCard from '../Cards/BasicCard/BasicCard';
import styles from './BasicGrid.module.css'
import { useEffect, useState } from 'react';
import PollCard from '../Cards/PollCard/PollCard';
import GraphCard from '../Cards/GraphCard/GraphCard';

export interface Iloaders{
  [key: string]: boolean;
}

export interface Ipoll{
  id?: number;
  question?: string;
}

export interface IdailyUser{
  date?: string;
  new_users?: number;
}
export interface IdailyPoll{
  date?: string;
  new_polls?: number;
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

  const { size } = props;
  const [loaders, setLoaders] = useState<Iloaders>(init_loaders)
  const [users, setUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [polls, setPolls] = useState<number>(0)
  const [admins, setAdmins] = useState<number>(0)
  const [todayPolls, setTodayPolls] = useState<number>(0)
  const [activeUsersToday, setActiveUsersToday] = useState<number>(0)
  const [popularPoll, setPopularPoll] = useState<Ipoll>({})
  const [newestPoll, setNewestPoll] = useState<Ipoll>({})
  const [dailyUsers, setDailyUsers] = useState<IdailyUser[]>([{}])
  const [dailyPolls, setDailyPolls] = useState<IdailyPoll[]>([{}])

  useEffect(() =>{
    // GET USERS, USERS_ACTIVE
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/users_counts_data`, params)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data["total"]);
        setActiveUsers(data["active"]);
      });
      loaders["users"] = false;
      loaders["active_users"] = false;
      setLoaders(loaders);
  },[]);

  useEffect(() =>{
    // GET POLLS
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/polls_counts`, params)
      .then((res) => res.json())
      .then((data) => {
        setPolls(data["total"]);
      });
      loaders["polls"] = false;
      setLoaders(loaders);
  },[]);

  useEffect(() =>{
    // GET ADMINS
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/admins_counts`, params)
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data["total"]);
      });
      loaders["admins"] = false;
      setLoaders(loaders);
  },[]);


  useEffect(() =>{
    // GET Today Polls
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/today_polls`, params)
      .then((res) => res.json())
      .then((data) => {
        setTodayPolls(data["total"]);
      });
      loaders["today_polls"] = false;
      setLoaders(loaders);
  },[]);

  useEffect(() =>{
    // GET Today Active Users
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/acctive_users_today`, params)
      .then((res) => res.json())
      .then((data) => {
        setActiveUsersToday(data["total"]);
      });
      loaders["active_users_today"] = false;
      setLoaders(loaders);
  },[]);

  useEffect(() =>{
    // GET Popular Poll
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/most_popular_poll`, params)
      .then((res) => res.json())
      .then((data) => {
        setPopularPoll({id: data["poll_id"], question: data["question"]});
      });
      loaders["popular_poll"] = false;
      setLoaders(loaders);
  },[]);

  useEffect(() =>{
    // GET Newest Poll
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/newest_poll`, params)
      .then((res) => res.json())
      .then((data) => {
        setNewestPoll({id: data["id"], question: data["question"]});
      });
      loaders["newest_poll"] = false;
      setLoaders(loaders);
  },[]);

  useEffect(() =>{
    // GET Daily Users
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/daily_users`, params)
      .then((res) => res.json())
      .then((data) => {
        setDailyUsers(data);
      });
      loaders["daily_users"] = false;
      setLoaders(loaders);
  },[]);


  useEffect(() =>{
    // GET Daily Polls
    const params = {
      method: 'GET'
    }
    setLoaders(loaders)
    fetch(`http://localhost:5000/daily_polls`, params)
      .then((res) => res.json())
      .then((data) => {
        setDailyPolls(data);
      });
      loaders["daily_polls"] = false;
      setLoaders(loaders);
  
    },[]);

  return (
    <div className={styles.dashboard}>
        <div className={styles.div1}> <BasicCard loading={loaders.users} data={users} label={"Users"} /> </div>
        <div className={styles.div2}> <BasicCard loading={loaders.active_users} data={activeUsers} label={"Active Users"} /></div>
        <div className={styles.div3}> <BasicCard loading={loaders.polls} data={polls} label={"Polls"} /></div>
        <div className={styles.div4}> <BasicCard loading={loaders.today_polls} data={todayPolls} label={"New Polls Today"} /></div>
        <div className={styles.div5}> <BasicCard loading={loaders.admins} data={admins} label={"Admins"} /></div>
        <div className={styles.div6}> <BasicCard loading={loaders.active_users_today} data={activeUsersToday} label={"Active Users Today"} /></div>
        <div className={styles.div7}> <PollCard loading={loaders.popular_poll} poll_question={popularPoll.question} poll_id={popularPoll.id} label={"Most Popular Poll"}/></div>
        <div className={styles.div8}> <PollCard loading={loaders.newest_poll} poll_question={newestPoll.question} poll_id={newestPoll.id} label={"Newest Poll"} /></div>
        <div className={styles.div9}> <GraphCard loading={loaders.daily_users} data={dailyUsers} xAxis={"date"} yAxis={"new_users"}  label={"New Users per Day"}/></div>
        <div className={styles.div10}> <GraphCard loading={loaders.daily_polls} data={dailyPolls} xAxis={"date"} yAxis={"new_polls"} label={"New Polls per Day"}/></div>
        <div className={styles.div11}> <BasicCard loading={loaders.active_users_ratio} data={"#45 Where is the best pizza in Haifa?"} label={"Active Users Ratio"}/>  </div>
        <div className={styles.div12}> <BasicCard loading={loaders.most_answered_polls} data={"#45 Where is the best pizza in Haifa?"} label={"Most Popular Polls"}/> </div>
        <div className={styles.div13}> <BasicCard loading={loaders.admins_compare} data={"#45 Where is the best pizza in Haifa?"} label={"Admins Activity"}/> </div>
        <div className={styles.div14}> <BasicCard loading={loaders.most_clear} data={"#45 Where is the best pizza in Haifa?"} label={"Easiest Decision"}/> </div>

    </div>
  );
}