import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import TopMenu from '../TopMenu/TopMenu';
import BasicGrid from '../BasicGrid/BasicGrid';


const Home = (props: any) => {
  // const [access, setAccess] = useState(0)
  const { token, removeToken, userName } = props;

  //All this nonsense is for accessing routes that are protected in the server~!
  // const header = 'Bearer ' + token;
  // useEffect(() => {
  //   fetch("http://localhost:5000/", {
  //     headers: {
  //       'Authorization': header,
  //       'Access-Control-Allow-Origin': "*"
  //     },
  //   }).then((response) => {
  //     if (response.ok)
  //       setAccess(1);
  //     else {
  //       setAccess(2);
  //     }
  //   })
  // }, [token])

  return (
    // <div>
    //   {access === 1 && <div>
    //     <TopMenu removeToken={removeToken} userName={userName} />
    //     <BasicGrid />
    //   </div>}
    //   {access === 2 && <text> unauhorized </text>}
    // </div>
    <div>
      <TopMenu removeToken={removeToken} userName={userName} />
      <BasicGrid />
    </div>


  )
}


export default Home;
