import { useState } from 'react';

function Login(props: any) {

  const [loginForm, setloginForm] = useState({
    username: "",
    password: ""
  })

  function logMeIn(event: any) {
    const data = {
      username: loginForm.username,
      password: loginForm.password
    }
    fetch("http://localhost:5000/token", {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json()
      }).then((data) => {
        props.setToken(data.access_token)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
    setloginForm(({
      username: "",
      password: ""
    }))

    event.preventDefault()
  }

  function handleChange(event: any) {
    const { value, name } = event.target
    setloginForm(prevNote => ({
      ...prevNote, [name]: value
    })
    )
  }

  return (
    <div>
      <h1>Login</h1>
      <form className="login">
        <input onChange={handleChange}
          type="text"
          name="username"
          placeholder="User Name"
          value={loginForm.username} />
        <input onChange={handleChange}
          type="password"
          name="password"
          placeholder="Password"
          value={loginForm.password} />

        <button onClick={logMeIn}>Submit</button>
      </form>
    </div>
  );
}

export default Login;