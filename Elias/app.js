import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';

export const history = createHashHistory();

var loggedIn = false;
var regPress = false;
var userid = 0;

class LoginPage extends React.Component {
	render(){
		return (
			<div>
				<h1>Innlogging</h1>
				<input type='text' ref='inpUser' placeholder='brukernavn' />
				<input type='password' ref='inpPassword' placeholder='passord' /><span />
				<button ref='btnLogin'>Logg inn</button>
				<button ref='btnReg'>Ny bruker</button>
			</div>
		);
	}
	componentDidMount(){
		this.refs.btnLogin.onclick = () => {
				var inpUser = this.refs.inpUser.value;
				var inpPassword = this.refs.inpPassword.value;

				userService.loginUser(inpUser, inpPassword, (result) => {
					if(result != undefined){
						console.log("logget inn bruker");
						userid = result.id;
						loggedIn = true;
						history.push('/Navbar/');
					}else{
						console.log("mislykket innlogging");
						loggedIn = false;
					}
				})
			}
			this.refs.btnReg.onclick = () => {
				regPress = true;
				history.push('/register/');
			}
		}
	}

class Register extends React.Component {
	render(){
		if(regPress){
			return(
				<div>
					<h1>Registrering</h1>
					<h5>Fyll ut skjemaet</h5>
					<form>
						<label>
							Fornavn:<br />
							<input ref='regFirstName' type='text' /><br />
						</label>
						<label>
							Etternavn:<br />
							<input ref='regLastName' type='text' /><br />
						</label>
						<label>
							Adresse:<br />
							<input ref='regAddress' type='text' /><br />
						</label>
						<label>
							Epost:<br />
							<input ref='regEmail' type='text' /><br />
						</label>
						<label>
							By:<br />
							<input ref='regCity' type='text' /><br />
						</label>
						<label>
							Postnummer:<br />
							<input ref='regZip' type='number' /><br />
						</label>
						<label>
							Tlf:<br />
							<input ref='regPhone' type='number' /><br />
						</label>
						<label>
							Alder:<br />
							<input ref='regAge' type='number' /><br />
						</label>
						<label>
							Passord:<br />
							<input ref='regPassword' type='password' /><br />
						</label>
					</form>
					<button ref='btnSendReg'>Registrer</button>
				</div>
			)
		}
	}	//bør man heller ha en form-action og knappen inne i formen?
	componentDidMount(){
		this.refs.btnSendReg.onclick = () => {
		 	var firstname = this.refs.regFirstName.value;
			var lastname = this.refs.regLastName.value;
			var address = this.refs.regAddress.value;
			var email = this.refs.regEmail.value;
			var password = this.refs.regPassword.value;
			var city = this.refs.regCity.value;
			var zip = this.refs.regZip.value;
			var phone = this.refs.regPhone.value;
			var age = this.refs.regAge.value;

			userService.addUser(firstname, lastname, address, email, password, city, zip, phone, age, (result) => {
				console.log('sendt registrering');
		})
	}
}
}

//Ikke bruk forceUpdate

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
				<span ref='userName'></span><br />
				<span ref='userAddress'></span><br />
				<span ref='userEmail'></span>
			</div>
		);
	}
	componentDidMount(){
		var userName = document.getElementById('userName');
		var userEmail = document.getElementById('userEmail');

 		userService.getUser(userid,(result) => {
			this.refs.userName.innerText += result.firstname;
			this.refs.userName.innerText += " " + result.lastname;
			this.refs.userAddress.innerText += result.address;
			this.refs.userEmail.innerText += result.email;
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
				<Route excat path='/register' component={Register}/>
				<Route excat path='/calendar' component={Calendar}/>
				<Route excat path='/profile' component={Profile}/>
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
