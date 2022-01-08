// import logo from '../logo.svg'

function Header(props: any) {

  function logMeOut() {
    fetch("http://localhost:5000/logout", {
      method: "POST",
    })
    .then((response) => {
       props.removeToken()
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    return(
        <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <button onClick={logMeOut}> 
                Logout
            </button>
        </header>
    )
}

export default Header;