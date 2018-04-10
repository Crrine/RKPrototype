import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';

export const history = createHashHistory();

let loggedIn = false;
let regPress = false;
let userid = 0;

class LoginPage extends React.Component {
	render(){
		return (
			<div>
				<h1>Innlogging</h1>
				<input type='text' ref='inpUser' placeholder='epost' />
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
					<button onClick = {() => {
						history.push('/loginPage/'),
						this.forceUpdate()}}>Tilbake</button>
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
				alert('Brukeren er opprettet');
				history.push('/loginPage/');
				this.forceUpdate(); //Ikke bruke forceUpdate
			})
			// alert('Informasjonen er ugyldig'); lag noen if-error-sak
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

class Profile extends React.Component{
	render(){
		return(
			<div>
				<h1>Din profil</h1>
				<span ref='userName'></span><br />
				<span ref='userEmail'></span><br />
				<button ref='btnShowInfo'>Vis info</button>
				<button onClick = {() => {
					history.push('/editprofile/'),
					this.forceUpdate()}}>Rediger</button>
				<div ref='showInfo'>
					<span ref='userAddress'></span><br />
					<span ref='userCity'></span><br />
					<span ref='userZip'></span><br />
					<span ref='userPhone'></span><br />
					<span ref='userAge'></span><br />
				</div>
			</div>
		);
	}
	componentDidMount(){
 		userService.getUser(userid,(result) => {
			let btnShowInfoPressed = false;

			this.refs.userName.innerText = result.firstname;
			this.refs.userName.innerText += " " + result.lastname;
			this.refs.userEmail.innerText = result.email;

			this.refs.btnShowInfo.onclick = () => {
				if(btnShowInfoPressed == false){
					this.refs.showInfo.innerText =
					" Adresse: " + result.address + '\n' +
					" By: " + result.city + '\n' +
					" Postnummer: " + result.zip + '\n' +
					" Tlf: " + result.phone + '\n' +
					" Alder: " + result.age + '\n';
					this.refs.btnShowInfo.innerText = "Skjul info";
					btnShowInfoPressed = true;
				}else{
					this.refs.showInfo.innerText = "";
					this.refs.btnShowInfo.innerText = "Vis info";
					btnShowInfoPressed = false;
				}
			}
		});
	}
}

class EditProfile extends React.Component{
	render(){
		return(
			<div>
				<h1>Rediger profil</h1>
				<form>
					<label>
						Fornavn:<br />
						<input ref='editFirstName' type='text' /><br />
					</label>
					<label>
						Etternavn:<br />
						<input ref='editLastName' type='text' /><br />
					</label>
					<label>
						Adresse:<br />
						<input ref='editAddress' type='text' /><br />
					</label>
					<label>
						Epost:<br />
						<input ref='editEmail' type='text' /><br />
					</label>
					<label>
						By:<br />
						<input ref='editCity' type='text' /><br />
					</label>
					<label>
						Postnummer:<br />
						<input ref='editZip' type='number' /><br />
					</label>
					<label>
						Tlf:<br />
						<input ref='editPhone' type='number' /><br />
					</label>
					<label>
						Alder:<br />
						<input ref='editAge' type='number' /><br />
					</label>
					<label>
						Passord:<br />
						<input ref='editPassword' type='password' /><br />
					</label>
				</form>
				<button ref='btnSendEdit'>Lagre</button>
				<button onClick = {() => {
					history.push('/profile/'),
					this.forceUpdate()}}>Angre</button>
			</div>
		)
	}
	componentDidMount(){
			userService.getUser(userid,(result) => {
				this.refs.editFirstName.value = result.firstname;
				this.refs.editLastName.value = result.lastname;
				this.refs.editAddress.value = result.address;
				this.refs.editEmail.value = result.email;
				this.refs.editCity.value = result.city;
				this.refs.editZip.value = result.zip;
				this.refs.editPhone.value = result.phone;
				this.refs.editAge.value = result.age;
				this.refs.editPassword.value = result.password;
			});

		this.refs.btnSendEdit.onclick = () => {
		 	let newFirstname = this.refs.editFirstName.value;
			let newLastname = this.refs.editLastName.value;
			let newAddress = this.refs.editAddress.value;
			let newEmail = this.refs.editEmail.value;
			let newPassword = this.refs.editPassword.value;
			let newCity = this.refs.editCity.value;
			let newZip = this.refs.editZip.value;
			let newPhone = this.refs.editPhone.value;
			let newAge = this.refs.editAge.value;

			userService.editUser(userid,newFirstname, newLastname, newAddress, newEmail, newPassword, newCity, newZip, newPhone, newAge, (result) => {
			})
			console.log('Oppdatert bruker - ID:');
			alert('Brukerinformasjonen ble oppdatert');
			history.push('/profile/');
			this.forceUpdate();
		}
	}
}

class Homepage extends React.Component {
	render(){
		return(
			<div>
				<h1>Aktuelle saker</h1>
			</div>
		);
	}
}

class Events extends React.Component {
	render(){
		return(
			<div>
				<h1>Arrangementer</h1>
				<h4>Kommende arrangementer</h4>
				<button ref='showMoreEvents'>Vis flere</button>
				<br /><br />
				<div ref='upcoming'></div>
			</div>
		);
	}
	componentDidMount(){
		let i = 0;

		userService.getEvents((result) => {
				for(let event of result){
					let divEvent = document.createElement('DIV');

					divEvent.innerText = event.name + '\n' +
						'Lokasjon: ' + event.area + '\n' +
						'Kontakttelefon: ' + event.contact_phone + '\n';

					this.refs.upcoming.appendChild(divEvent);
					divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
					i++;
					if(i==5){
						return;
						//Viser bare de 5 kommende arrangementene
					}
			}
		})
	}
}

class Contact extends React.Component {
	render(){
		return(
			<div>
				<h1>Kontakt oss</h1>
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

class Search extends React.Component {
	render(){
		return(
			<div>
				<h1>Brukersøk</h1>
				<input ref='searchField' type="text" placeholder="navn, epost, tlf" />
				<button ref='btnSearch'>Søk</button>
				<div ref='output'>
				</div>
			</div>
		);
		//brukere skal kunne søke opp epost og telefonnummer
	}
	componentDidMount(){
		this.refs.btnSearch.onclick = () => {
			let keyword = this.refs.searchField.value;
			userService.search(keyword, (result) => {
				this.refs.output.innerText = '';
				console.log(result);

				if(result==''){
					this.refs.output.innerText = '\n' + 'Ingen resultater';
				}

				for(let user of result){
					// let divOutput = document.createElement('DIV');

					this.refs.output.innerText += '\n' + user.firstname + ' ' + user.lastname + '\n' +
						'epost: ' + user.email + '\n' +
						'telefon: ' + user.phone + '\n';

					// this.refs.output.appendChild(divOutput);
					// divOutput.innerText += '\n'; //Fjern dette når du legger til if-en
				}
			})
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
//Sende tilbakemelding etter registrering
//Spesifiser at man må logge inn med email
//Må kunne bruke enter til søk, logg inn, registrer, etc
