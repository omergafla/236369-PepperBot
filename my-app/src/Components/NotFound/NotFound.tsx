import React from 'react';
import './NotFound.css';
import TopMenu from '../TopMenu/TopMenu';


const NotFound = (props: any) => {
  return (
  <div>
    <a href="/"><img className="pepper" src={require('./pepper.jpeg')} height="40px"></img></a>
    <img className='not-found' src={require('./3747371.jpg')}></img>
  </div>
  
  )
};

export default NotFound;
