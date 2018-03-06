import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';

export const history = createHashHistory();

var loggedIn = false;

class LoginPage extends React.Component {
	render(){
		return (
			<div>
				<h1>Innlogging</h1>
				<input type='text' ref='inpUser' placeholder='brukernavn' />
				<input type='password' ref='inpPassword' placeholder='passord' /><span />
				<button ref='btn'>Logg inn</button>
			</div>
		);
	}
	componentDidMount(){
		this.refs.btn.onclick = () => {
				var inpUser = this.refs.inpUser.value;
				var inpPassword = this.refs.inpPassword.value;

				userService.loginUser(inpUser, inpPassword, (result) => {
					if(result != undefined){
						console.log("logget inn bruker");
						loggedIn = true;
						history.push('/Navbar/');
					}else{
						console.log("mislykket innlogging");
						loggedIn = false;
					}
				})
			}
		}
	}

class Navbar extends React.Component {
	render(){
		if(loggedIn){
			return(
				<div>
					<h1>Navigasjonsbaren</h1>
					<nav>
						<button ref='logout' onClick = {() => {
							loggedIn = false, history.push('/loginPage/'), console.log('logget ut bruker'),
							this.forceUpdate()}}>Logg ut</button><br />
						<Link to='/homepage'>Hjemmeside</Link><br />
						<Link to='/calendar'>Kalender</Link><br />
						<Link to='/profile'>Profil</Link><br />
					</nav>
				</div>
			);
		}else{
			return(
				<div>
					<Link to='/loginPage'>Logg inn</Link>
				</div>
			)
		}
	}
}

	class Profile extends React.Component{
		render(){
			return(
				<div>
					<h1>Profil</h1>
					<ul>
						<li ref='userName'></li>
						<li ref='userEmail'></li>
					</ul>
				</div>
			);
		}
		componentDidMount(){
			var userName = document.getElementById('userName');
			var userEmail = document.getElementById('userEmail');

	 		userService.getUser(2,(result) => {
				this.refs.userName.innerText += result.FirstName;
				this.refs.userEmail.innerText += result.Email;
	    });
		}
	}

class Homepage extends React.Component {
	render(){
		return(
			<div>
				<h1>Hjemmeside</h1>
			</div>
		);
	}
}

class Calendar extends React.Component {
	render(){
		return(
			<div>
				<h1>Kalender</h1>
			</div>
		);
	}
}

ReactDOM.render((
  <HashRouter>
    <div>
      <Navbar />
      <Switch>
				<Route exact path='/homepage' component={Homepage}/>
				<Route excat path='/loginPage' component={LoginPage}/>
				<Route excat path='/calendar' component={Calendar}/>
				<Route excat path='/profile' component={Profile}/>
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
