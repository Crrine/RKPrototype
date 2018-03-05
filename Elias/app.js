import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { customerService } from './services';

class User {
			constructor(username, password){
				this.username = username;
				this.password = password;
			}
		}

var userArr = [];

var p = new User('elias','pass123');
userArr.push(p);

function login(){
	var inpUser = document.getElementById('inpUser').value;
	var inpPassword = document.getElementById('inpPassword').value;

	for(var i=0;i<userArr.length;i++){
		if(inpUser==userArr[i].username&&inpPassword==userArr[i].password){
		output.innerText = 'logget inn';
		console.log('logget inn');
		return true;
	}else{
		output.innerText = 'feil brukernavn/passord';
		console.log('feil brukernavn/passord');
		return false;
		i++;
		}
	}
}

class Navbar extends React.Component {
	render(){
		return(
			<div>
				<h1>Navigasjonsbaren</h1>
				<nav>
					<Link to='/loginPage'>Logg ut</Link><br />
					<Link to='/homepage'>Hjemmeside</Link><br />
					<Link to='/calendar'>Kalender</Link><br />
					<Link to='/profile'>Profil</Link><br />
				</nav>
			</div>
		);
	}
}

class LoginPage extends React.Component {
	render(){
		return (
			<div>
				<h1>Innlogging</h1>
				<input type='text' id='inpUser' placeholder='username' />
				<input type='password' id='inpPassword' placeholder='password' /><span />
				<button id='btn'>Login</button>
				<div id='output'></div><br />
			</div>
		);
	}
	componentDidMount(){
		document.getElementById('btn').onclick = () => {
			login();
		}
		var output = document.getElementById('output');
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

class Profile extends React.Component {
	render(){
		return(
			<div>
				<h1>Profil</h1>
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
