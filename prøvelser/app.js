import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import globalize from 'globalize';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
export const history = createHashHistory();

let loggedIn = false;
let regPress = false;
let admin = false;
let userid = 0;
let eventID = 0;

class LoginPage extends React.Component {
	render(){
		return (
			<div>
				<h1>Innlogging</h1>
				<input type='text' ref='inpUser' placeholder='epost' />
				<input type='password' ref='inpPassword' placeholder='passord' /><span />
				<button ref='btnLogin'>Logg inn</button>
				<button ref='btnReg'>Ny bruker</button><br /><br />
				<div ref='loginOutput'></div>
				<button ref='btnForgotPassword' hidden onClick = {() => {
					history.push('/forgotPassword/'),
					this.forceUpdate()}}>glemt passord</button>
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
						this.refs.loginOutput.innerText = 'feil brukernavn/passord';
						this.refs.btnForgotPassword.hidden = false;
					}
				})
			}
			this.refs.btnReg.onclick = () => {
				regPress = true;
				history.push('/register/');
			}
		}
	}

class ForgotPassword extends React.Component{
	render(){
		return(
			<div>
				<h1>Glemt passord</h1>
				<p>Venligst skriv inn din epostadresse, så vil vi sende deg en nytt passord</p>
				<input type='text' ref='inpMail' />
			</div>
		)
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
				// history.push('/loginPage/');
				// this.forceUpdate();
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
				<span ref='userPoints'></span><br />
				Kommende arrangementer:<br />
				<span ref='upcomingEvents'></span>
				<button ref='btnShowInfo'>Vis info</button>
				<button onClick = {() => {
					history.push('/editprofile/'),
					this.forceUpdate()}}>Rediger</button>
				<button ref='btnDeactivate'>Deaktiver</button>
				<button onClick = {() => {
					history.push('/competence/'),
					this.forceUpdate()}}>Kompetanse</button>
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
		userService.getUpcomingEvents(userid,(result) => {
			for(let event of result){
				this.refs.upcomingEvents.innerText += event.name + '\n';
				console.log(event);
			}
		})

 		userService.getUser(userid,(result) => {
			let btnShowInfoPressed = false;

			this.refs.userName.innerText = result.firstname;
			this.refs.userName.innerText += " " + result.lastname;
			this.refs.userEmail.innerText = result.email;
			this.refs.userPoints.innerText = "Vaktpoeng: " + result.points;

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
		this.refs.btnDeactivate.onclick = () => {
			let r = confirm('Er du sikker på at du vil deaktivere brukeren din?');
			if(r == true){
				userService.deactivateUser(userid,(result) => {
					console.log('Deaktivert bruker - ID:' + userid);
					// history.push('/loginPage/');
					// this.forceUpdate();
				});
			}
		}
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
					this.forceUpdate()}}>Tilbake</button>
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
			let a = confirm('Er du sikker på at du vil lagre endringene?');
			if(a==true){
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
				console.log('Oppdatert bruker - ID:' + userid);
				history.push('/profile/');
				this.forceUpdate();
			}
		}
	}
}

class Competence extends React.Component{
	render(){
		return(
			<div>
				<h1>Kompetanse</h1>
				<div>
					<p>Legg til kompetanse:</p>
					<form ref='compForm'>
						<select ref='compSelect'>
						</select>
					</form>
					<button ref='btnAddComp'>Legg til</button>
					<button ref='btnProfile'>Tilbake</button>
					<div ref='compOutput'></div>
				</div>
			</div>
		)
	}
	componentDidMount(){
		let compid = 0;

		this.refs.btnProfile.onclick = () => {
			history.push('/profile');
			this.forceUpdate();
		}

		userService.getCompetences((result) => {
			for(let comp of result){
				let compSel = document.createElement('OPTION');
				let compTitle = document.createTextNode(comp.title);

				compSel.appendChild(compTitle);
				this.refs.compSelect.appendChild(compSel);
			}
		})
		this.refs.btnAddComp.onclick = () => {
			let title = this.refs.compSelect.value;
			let finished = '2018-01-01';

			userService.getCompetence(title,(result) => {
				compid = result.compID;
			})
			userService.regCompetence(userid, compid, finished, (result) => {
				console.log('test');
				console.log(compid);
			})
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
				<button ref='btnNewEvent'>Legg til arrangement</button>
				<br /><br />
				<div ref='upcoming'></div>
			</div>
		);
	}
	componentDidMount(){
		let i = 0;

		this.refs.btnNewEvent.onclick = () => {
			history.push('/newEvent/');
			this.forceUpdate();
		}

		userService.getEvents((result) => {
				for(let event of result){
					let divEvent = document.createElement('DIV');

					let btnEvent = document.createElement('BUTTON');
					let btnEventTxt = document.createTextNode('Informasjon');
					let clickedEvent = event.eventID;

					btnEvent.appendChild(btnEventTxt);
					btnEvent.setAttribute('id', event.eventID);

					btnEvent.onclick = () => {
						sendToEvent(clickedEvent);
					}

					divEvent.innerText = event.name + '\n' +
						'Lokasjon: ' + event.area + '\n' +
						'Kontakttelefon: ' + event.contact_phone + '\n';

					divEvent.appendChild(btnEvent);
					this.refs.upcoming.appendChild(divEvent);
					// divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
					i++;
					if(i==5){
						return;
						//Viser bare de 5 kommende arrangementene
					}
			}
		})
		function sendToEvent(id){
					eventID = id;
					history.push('/divEvent/');

				}
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
			<button ref='backToArr'>Arrangementer</button>
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
		this.refs.backToArr.onclick = () => {
			history.push('/events/');
			this.forceUpdate();
		}
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
								<input ref='regStartDato' type='datetime-local' /><br />
							</label>
							<label>
								sluttdato:<br />
								<input ref='regSluttDato' type='datetime-local' /><br />
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
						<button ref='btnSendArr'>Registrer</button>
						<button ref='btnBackArr'>Tilbake</button>
					</div>
				)
			}
			componentDidMount() {

				this.refs.btnBackArr.onclick = () => {
					history.push('/events/');
					this.forceUpdate();
				}

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
						history.push('/events/');
						this.forceUpdate();
				})
			}
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
	constructor(props) {
		super(props);
		this.state = {
		events:[],
		}
	}
	// setArrinfo(event) {
	// //	console.log(event)
	// 	var title = event.title;
	// 	var datestart = event.startDate;
	// 	var dateend = event.endDate;
	// 	eventID = event.eventID;


	setArrinfo(event) {
		console.log(event);
		var title = event.title;
		var datestart = event.startDate;
		var dateend = event.endDate;
		eventID = event.eventID;

		history.push('/divEvent/');

		// history.push('/divEvent/');



	}
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
				console.log(result);
					eventID = result[0].eventID;
			this.setState({events: result});
		})
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
		//Sørg for at når man går ut av profilen, endres userid tilbake til admin
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
					let clickedUser = user.userID;
					let divUser = document.createElement('DIV');
					let btnUser = document.createElement('BUTTON');
					let btnUserTxt = document.createTextNode('rediger');

					btnUser.appendChild(btnUserTxt);
					btnUser.setAttribute('id', user.userID);

					btnUser.onclick = () => {
						sendToUser(clickedUser);
					}

					let divUserTxt = document.createTextNode(user.firstname + ' ' + user.lastname + ' ' +
						'epost: ' + user.email + ' ' +
						'telefon: ' + user.phone);

						divUser.appendChild(divUserTxt);
						divUser.appendChild(btnUser);
						this.refs.output.appendChild(divUser);
					}

					function sendToUser(id){
								userid = id;
								history.push('/profile/');

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
				<Route excat path='/forgotPassword' component={ForgotPassword}/>
				<Route excat path='/register' component={Register}/>
				<Route excat path='/calendar' component={Calendar}/>
				<Route excat path='/profile' component={Profile}/>
				<Route excat path='/editprofile' component={EditProfile}/>
				<Route excat path='/events' component={Events}/>
				<Route excat path='/divEvent' component={divEvent}/>
				<Route excat path='/newEvent' component={NewEvent}/>
				<Route excat path='/contact' component={Contact}/>
				<Route excat path='/search' component={Search}/>
				<Route excat path='/competence' component={Competence}/>
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
