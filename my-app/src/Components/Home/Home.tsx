import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import TopMenu from '../TopMenu/TopMenu';
import BasicGrid from '../BasicGrid/BasicGrid';


const Home = (props: any) => {
  const [access, setAccess] = useState(false)
  const { token } = props;
  // if (!token && token !== "" && token !== undefined) {
  //   setAccess(true);
  // }
  useEffect(()=>{
    fetch("http://localhost:5000/", {
      credentials: 'include',
      headers: {
        "Authorization": 'Bearer ' + token,
      },
    }).then((response) =>{
      if (response.ok)
        return response.json()
      setAccess(false);
    })
    .then((data)=>{
      console.log(data);
      setAccess(true);
    })
  }, [token])

  return (
    access ? (<div>
    <TopMenu />
    <BasicGrid />
  </div>) : <text>unauhorized</text>
  
  
  
  )
}


export default Home;
