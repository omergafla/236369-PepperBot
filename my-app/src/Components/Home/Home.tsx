import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import TopMenu from '../TopMenu/TopMenu';
import BasicGrid from '../BasicGrid/BasicGrid';


const Home = (props: any) => {
  const [access, setAccess] = useState(false)
  const { token, removeToken } = props;
  const header = 'Bearer '+ token;
  // console.log(header);
  useEffect(()=>{
    fetch("http://localhost:5000/", {
      headers: {
        'Authorization': header,
        'Access-Control-Allow-Origin': "*"
      },
    }).then((response) =>{
      if (response.ok)
        setAccess(true);
      else{
        setAccess(false);
      }
    })
  }, [token])

  return (
    access ? (<div>
    <TopMenu removeToken={removeToken}/>
    <BasicGrid />
  </div>) : <text>unauhorized</text>
  
  
  
  )
}


export default Home;
