import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import globalize from 'globalize';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

export const history = createHashHistory();

let loggedIn = false;
let regPress = false;
let userid = 0;
var eventID = 0;

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
						<Link to='/nyttEvent'>NyttEvent</Link><br />
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
				<div ref='upcoming'></div>
			</div>
		);
	}
	componentDidMount(){
		userService.getEvents((result) => {
			for(let event of result){
				let divEvent = document.createElement('DIV');

				divEvent.innerText = event.name + '\n' +
					'Lokasjon: ' + event.area + '\n' +
					'Kontakttelefon: ' + event.contact_phone + '\n';

				this.refs.upcoming.appendChild(divEvent);
				divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
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

<<<<<<< HEAD
class editEvent extends React.Component {
	render() {
		return(
			<div>
			<form>
				<label>
					Navn på arrangementet:<br />
					<input ref='editArrName' type='text' /><br />
				</label>
				<label>
					Startdato:<br />
					<input ref='editStartDato' type='date' /><br />
				</label>
				<label>
					sluttdato:<br />
					<input ref='editSluttDato' type='date' /><br />
				</label>
				<label>
					kontakttelefon:<br />
					<input ref='editTlf' type='text' /><br />
				</label>
				<label>
					rolelist:<br />
					<input ref='editRoles' type='text' /><br />
				</label>
				<label>
					description:<br />
					<input ref='editDescript' type='text' /><br />
				</label>
				<label>
					Møtested:<br />
					<input ref='editMeet' type='text' /><br />
				</label>
			</form>
			<button ref='btneditArr'>Registrer Arrangement</button>
		</div>
	)
	}
	componentDidMount() {
		userService.getDivEvent(eventID,(result) => {
					this.refs.editArrName.innerText = result.name;
					this.refs.editStartDato.innerText = result.date_start;
					this.refs.editSluttDato.innerText = result.date_end;
					this.refs.editDescript.innerText = result.description;
					this.refs.editMeet.innerText = result.area;
					this.refs.edotTlf.innerText = result.contact_phone;
					this.refs.editRoles.innerText = result.rolelist_roleID;
		})
	}
}

class divEvent extends React.Component {
	render() {
		return(
			<div>
			<h1>Valgt arrangement: </h1> <br />
			arrangementets navn: <span height='300' ref='eventName'></span><br />
			Startdato: <span ref='eventstartdate'></span><br />
			Sluttdato: <span ref='eventsluttdate'></span><br />
			Møtested: <span ref='eventmøtested'></span><br />
			Kontaktinfo: <span ref='kontaktinfo'></span><br />
			rolleliste: <span ref='rolelist'></span><br />
			Beskrivelse: <br /> <span ref='eventinfo'></span><br /> <br />
			<button ref='editArr'>Rediger</button>
			</div>
		)
	}
	componentDidMount() {
		userService.getDivEvent(eventID,(result) => {
					this.refs.eventName.innerText = result.name;
					this.refs.eventstartdate.innerText = result.date_start;
					this.refs.eventsluttdate.innerText = result.date_end;
					this.refs.eventinfo.innerText = result.description;
					this.refs.eventmøtested.innerText = result.area;
					this.refs.kontaktinfo.innerText = result.contact_phone;
					this.refs.rolelist.innerText = result.rolelist_roleID;
		})
		this.refs.editArr.onclick = () => {
			history.push('/editEvent/');
		}
	}
}
=======
>>>>>>> 2766b8f79c229c41b050ddabb19a290f2800e7d8

class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		events:[],
		}
	}

<<<<<<< HEAD
setArrinfo(event) {
	console.log(event)
	var title = event.title;
	var datestart = event.startDate;
	var dateend = event.endDate;
	eventID = event.eventID;

	let diversEvent = document.getElementById('diversEvent');
	diversEvent.innerText = title + "\n" + datestart + "\n" + dateend + "\n" + eventID;
	history.push('/divEvent/')

}
=======
	setArrinfo(event) {
		console.log("clicked")


	}
>>>>>>> 2766b8f79c229c41b050ddabb19a290f2800e7d8
	render() {
		return (
			<div>
			<BigCalendar
											messages={{next:"Neste",previous:"Tilbake",today:"I dag",month:"Måned",week:"Uke",work_week:"Jobbuke",day:"Dag",agenda:"Agenda", date:"Dato", time:"Tid", event:"Arrangement"}}
											events={this.state.events}
											step={60}
											startAccessor='startDate'
											endAccessor='endDate'
											showMultiDayTimes
											defaultDate={new Date()}
											style={{height: 400}}
											onSelectEvent={event => this.setArrinfo(event) == {divEvent}}
										/>
										<div>
										<button ref='CreateEvent'>Lag nytt arrangement</button>
										</div>
										<div id='diversEvent'></div>
										</div>
		);
	}
	componentDidMount() {
		this.refs.CreateEvent.onclick = () => {
			history.push('/nyttEvent/');
			this.forceUpdate();
		}


	}
	componentWillMount() {
			userService.getEvent((result) => {
<<<<<<< HEAD
				console.log(result);
					eventID = result[0].eventID;
=======
>>>>>>> 2766b8f79c229c41b050ddabb19a290f2800e7d8
			this.setState({events: result});

		})

	}
}

class NewEvent extends React.Component {
	render(){
				return(
					<div>
						<h1>Nytt Arrangement</h1>
						<form>
							<label>
								Navn på arrangementet:<br />
								<input ref='regArrName' type='text' /><br />
							</label>
							<label>
								Startdato:<br />
								<input ref='regStartDato' type='date' /><br />
							</label>
							<label>
								sluttdato:<br />
								<input ref='regSluttDato' type='date' /><br />
							</label>
							<label>
								kontakttelefon:<br />
								<input ref='regTlf' type='text' /><br />
							</label>
							<label>
								rolelist:<br />
								<input ref='regRoles' type='text' /><br />
							</label>
							<label>
								description:<br />
								<input ref='regDescript' type='text' /><br />
							</label>
							<label>
								Møtested:<br />
								<input ref='regMeet' type='text' /><br />
							</label>
						</form>
						<button ref='btnSendArr'>Registrer Arrangement</button>
					</div>
				)
			}
			componentDidMount() {
				this.refs.btnSendArr.onclick = () => {
				 	let name = this.refs.regArrName.value;
					let date_start = this.refs.regStartDato.value;
					let date_end = this.refs.regSluttDato.value;
					let contact_phone = this.refs.regTlf.value;
					let rolelist_roleID = this.refs.regRoles.value;
					let description = this.refs.regDescript.value;
					let area = this.refs.regMeet.value;

					userService.addEvent(name, date_start, date_end, contact_phone, rolelist_roleID, description, area, (result) => {
						alert('Arrangementet er opprettet');
						history.push('/Navbar/');
						this.forceUpdate();
					})
			}
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
				>Route exact path='editEvent' component={editEvent}/>
				<Route exact path='/divevent' component={divEvent}/>
				<Route exact path='/nyttEvent' component={NewEvent}/>
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
