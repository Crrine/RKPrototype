import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
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
				<Link to='/loginPage'>Logg ut</Link><br />
				<Link to='/home'>Hjemmeside</Link>
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
				<Link to='/Home'>Hjemmeside</Link>
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

class Home extends React.Component {
	render(){
		return(
			<div>
				<h1>Hjemmeside</h1>
			</div>
		);
	}
}

ReactDOM.render((
  <HashRouter>
    <div>
      <Navbar />
      <Switch>
				<Route exact path='/home' component={Home}/>
				<Route excat path='/loginPage' component={LoginPage}/>
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
