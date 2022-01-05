import React from 'react';
import styles from './Home.module.css';
import TopMenu from '../TopMenu/TopMenu';
import BasicGrid from '../BasicGrid/BasicGrid';


const Home = () => (
  <div className={styles.Home}>
    <TopMenu />
    <BasicGrid />
  </div>
);

export default Home;
