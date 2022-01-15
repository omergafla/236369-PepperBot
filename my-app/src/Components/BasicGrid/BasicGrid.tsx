import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BasicCard from '../Cards/BasicCard/BasicCard';
import styles from './BasicGrid.module.css'
import { useEffect, useState } from 'react';
import PollCard from '../Cards/PollCard/PollCard';
import GraphCard from '../Cards/GraphCard/GraphCard';
import PieCard from '../Cards/PieCard/PieCard';

export interface Iloaders {
  [key: string]: boolean;
}

export interface Ipoll {
  id?: number;
  question?: string;
}

export interface IdailyUser {
  date?: string;
  new_users?: number;
}
export interface IdailyPoll {
  date?: string;
  new_polls?: number;
}
export interface IUsersRatio {
  active?: number;
  inactive?: number;
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
  const [usersRatio, setUsersRatio] = useState<IUsersRatio>({})
  const params = {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': "*"
    }
  }

  useEffect(() => {
    // GET USERS, USERS_ACTIVE
    setLoaders(loaders)
    fetch(`http://localhost:5000/users_counts_data`, params)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data["total"]);
        setActiveUsers(data["active"]);
        data["total"] === 0 ?
        setUsersRatio({ "active": 0, "inactive": 100 })
        :setUsersRatio({ "active": data["active"], "inactive": data["inactive"] })
      });
    loaders["users"] = false;
    loaders["active_users"] = false;
    loaders["active_users_ratio"] = false;
    setLoaders(loaders);
  }, []);

  useEffect(() => {
    // GET POLLS
    setLoaders(loaders)
    fetch(`http://localhost:5000/polls_counts`, params)
      .then((res) => res.json())
      .then((data) => {
        setPolls(data["total"]);
      });
    loaders["polls"] = false;
    setLoaders(loaders);
  }, []);

  useEffect(() => {
    // GET ADMINS
    setLoaders(loaders)
    fetch(`http://localhost:5000/admins_counts`, params)
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data["total"]);
      });
    loaders["admins"] = false;
    setLoaders(loaders);
  }, []);


  useEffect(() => {
    // GET Today Polls
    setLoaders(loaders)
    fetch(`http://localhost:5000/today_polls`, params)
      .then((res) => res.json())
      .then((data) => {
        setTodayPolls(data["total"]);
      });
    loaders["today_polls"] = false;
    setLoaders(loaders);
  }, []);

  useEffect(() => {
    // GET Today Active Users
    setLoaders(loaders)
    fetch(`http://localhost:5000/acctive_users_today`, params)
      .then((res) => res.json())
      .then((data) => {
        setActiveUsersToday(data["total"]);
      });
    loaders["active_users_today"] = false;
    setLoaders(loaders);
  }, []);

  useEffect(() => {
    // GET Popular Poll
    setLoaders(loaders)
    fetch(`http://localhost:5000/most_popular_poll`, params)
      .then((res) => res.json())
      .then((data) => {
        if (data["poll_id"] && data["question"]) {
          setPopularPoll({ id: data["poll_id"], question: data["question"] });
        }
      });
    loaders["popular_poll"] = false;
    setLoaders(loaders);
  }, []);

  useEffect(() => {
    // GET Newest Poll
    setLoaders(loaders)
    fetch(`http://localhost:5000/newest_poll`, params)
      .then((res) => res.json())
      .then((data) => {
        if (data["id"] && data["question"])
          setNewestPoll({ id: data["id"], question: data["question"] });
      });
    loaders["newest_poll"] = false;
    setLoaders(loaders);
  }, []);

  useEffect(() => {
    // GET Daily Users
    setLoaders(loaders)
    fetch(`http://localhost:5000/daily_users`, params)
      .then((res) => res.json())
      .then((data) => {
        setDailyUsers(data);
      });
    loaders["daily_users"] = false;
    setLoaders(loaders);
  }, []);


  useEffect(() => {
    // GET Daily Polls
    setLoaders(loaders)
    fetch(`http://localhost:5000/daily_polls`, params)
      .then((res) => res.json())
      .then((data) => {
        setDailyPolls(data);
      });
    loaders["daily_polls"] = false;
    setLoaders(loaders);

  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.div1}> <BasicCard backColor={"#FDCACE"} loading={loaders.users} data={users} label={"Users"} /> </div>
      <div className={styles.div2}> <BasicCard backColor={"#FEF1EB"} loading={loaders.active_users} data={activeUsers} label={"Active Users"} /></div>
      <div className={styles.div3}> <BasicCard backColor={"#D2E6D5"} loading={loaders.polls} data={polls} label={"Polls"} /></div>
      <div className={styles.div4}> <BasicCard backColor={"#D5C5E8"} loading={loaders.today_polls} data={todayPolls} label={"New Polls Today"} /></div>
      <div className={styles.div5}> <BasicCard backColor={"#FBE7C5"} loading={loaders.admins} data={admins} label={"Admins"} /></div>
      <div className={styles.div6}> <BasicCard backColor={"#F7D3BC"} loading={loaders.active_users_today} data={activeUsersToday} label={"Active Users Today"} /></div>
      <div className={styles.div7}> <PollCard loading={loaders.popular_poll} poll_question={popularPoll.question} poll_id={popularPoll.id} label={"Most Popular Poll"} /></div>
      <div className={styles.div8}> <PollCard loading={loaders.newest_poll} poll_question={newestPoll.question} poll_id={newestPoll.id} label={"Newest Poll"} /></div>
      <div className={styles.div9}> <GraphCard loading={loaders.daily_users} color={"#f0b9a1"} data={dailyUsers} xAxis={"date"} yAxis={"new_users"} label={"New Users per Day"} /></div>
      <div className={styles.div10}> <GraphCard loading={loaders.daily_polls} color={"#a9d1af"} data={dailyPolls} xAxis={"date"} yAxis={"new_polls"} label={"New Polls per Day"} /></div>
      <div className={styles.div11}> <PieCard loading={loaders.active_users_ratio} active={usersRatio.active} inactive={usersRatio.inactive} label={"Active Users Ratio"} />  </div>
    </div>
  );
}