import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';
import Events from './component/Events';
import Profile from './component/Profile';
import Search from './component/Search';
import Calendar from './component/Calendar';
import Contact from './component/Contact';
import Homepage from './component/Homepage';

import EditProfile from './component/EditProfile';


export const history = createHashHistory();
let loggedIn = false;
let regPress = false;
let userid = 0;


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
				let inpUser = this.refs.inpUser.value;
				let inpPassword = this.refs.inpPassword.value;

				userService.loginUser(inpUser, inpPassword, (result) => {
					if(result != undefined){
						console.log("logget inn bruker - ID:" + result.userID);
						userid = result.userID;
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
			 	let firstname = this.refs.regFirstName.value;
				let lastname = this.refs.regLastName.value;
				let address = this.refs.regAddress.value;
				let email = this.refs.regEmail.value;
				let password = this.refs.regPassword.value;
				let city = this.refs.regCity.value;
				let zip = this.refs.regZip.value;
				let phone = this.refs.regPhone.value;
				let age = this.refs.regAge.value;

				userService.addUser(firstname, lastname, address, email, password, city, zip, phone, age, (result) => {

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
						<Link to='/profile'>Din profil</Link><br />
						<Link to='/homepage'>Aktuelle saker</Link><br />
						<Link to='/events'>Arrangementer</Link><br />
						<Link to='/calendar'>Kalender</Link><br />
						<Link to='/contact'>Kontakt oss</Link><br />
						<Link to='/search'>Brukersøk</Link><br />
						<button ref='logout' onClick = {() => {
							loggedIn = false, history.push('/loginPage/'), console.log('logget ut bruker'),
							this.forceUpdate()}}>Logg ut</button><br />
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
				<Route excat path='/editprofile' component={EditProfile}/>
				<Route excat path='/events' component={Events}/>
				<Route excat path='/contact' component={Contact}/>
				<Route excat path='/search' component={Search}/>
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));


//Neste: Vise (og skjule) og oppdatere brukerinfo
//Må kunne endre passord
//Ikke bruk force.update
