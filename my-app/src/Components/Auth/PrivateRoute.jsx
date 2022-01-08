import { Navigate, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component,token, ...rest }) => {

  fetch("http://localhost:5000/", {
    headers:{
      Authorization: 'Bearer ' + token
    }
  })
  const isLoggedIn = AuthService.isLoggedIn()

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Navigate to={{ pathname: '/login'}} />
        )
      }
    />
  )
}

export default PrivateRoute