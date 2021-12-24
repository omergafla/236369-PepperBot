import React, { useState, useEffect} from 'react'

function App(){
  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/users").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
  return(
    <div>
       <p>{data.name}</p>
    </div>
    // data.map((user,i) => (
    //   <p key={"user_"+i}>{user.name}</p>
    // ))
    )
}

export default App