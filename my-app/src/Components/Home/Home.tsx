import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import TopMenu from '../TopMenu/TopMenu';
import BasicGrid from '../BasicGrid/BasicGrid';


const Home = (props: any) => {
  const { removeToken } = props;
  return (
    <div>
        <TopMenu removeToken={removeToken} />
        <BasicGrid />
    </div>
  )
}


export default Home;
