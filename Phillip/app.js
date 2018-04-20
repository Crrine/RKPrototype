import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import globalize from 'globalize';
import { NavLink } from 'react-router-dom';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

export const history = createHashHistory();

let regPress = false;
let userid = null;
let admin = false;
let eventID = null;
let viewid = null;
let redid = null;
let rolelistID = null;
let inactive = '';

class LoginPage extends React.Component {
	constructor() {
		super();
		this.userisloggedin;
	}
	render(){
		return (
			<div className="yolo">
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
				let email = this.refs.inpUser.value;

				userService.getThisUser(email, (result) => {
					let inactive = result.inactive;
					userService.checkIfUserIsInactive(email, inactive, (result) => {
						if (inactive == 1) {
							this.refs.loginOutput.innerText = 'Brukeren er ikke aktivert, kontakt administator';
							this.refs.btnForgotPassword.hidden = true;
							userid = null;
							userService.emptystorage();
						}
					})
				})
					userService.loginUser(inpUser, inpPassword, (result) => {

					if(result != undefined){
						console.log("logget inn bruker - ID:" + result.userID);
						this.userisloggedin = userService.browseruser()
						userid = this.userisloggedin.userID;
						history.push('/Navbar/');
						window.location.reload()
					}else {
						console.log("mislykket innlogging");
						this.refs.loginOutput.innerText = 'feil brukernavn/passord';
						this.refs.btnForgotPassword.hidden = false;

						userService.emptystorage();
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
					<button ref='sendPass'>Send</button>
				</div>
			)
		}
		componentDidMount(){

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
						<label> gjenta passord:<br />
						<input ref='repeatregPassword' type='password' /><br />
						</label>
					</form>
					<span ref="feilmelding"></span> <br />
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

			if (this.refs.repeatregPassword.value == this.refs.regPassword.value) {
			userService.addUser(firstname, lastname, address, email, password, city, zip, phone, age, (result) => {
				alert('Brukeren er opprettet');
				history.push('/loginPage/');
				this.forceUpdate(); //Ikke bruke forceUpdate
			})
		} else {
			this.refs.feilmelding.innerText = 'Passordene er ikke like';
		}
			// alert('Informasjonen er ugyldig'); lag noen if-error-sak
		}
	}
}

class Navbar extends React.Component {
	constructor() {
		super();
		this.userisloggedin
	}
	render(){
		this.userisloggedin = userService.browseruser();
		if(this.userisloggedin){
			return(
				<div>
						<meta name="viewport" content="width=device-width, initial-scale=1.0" />
						<link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" />
						<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
						<meta charSet="utf-8" />
						<title>Røde Kors Sanitetsvakt</title>

						<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
							<img className="logo" src="rodekorsw-01.png" alt="Røde Kors Sanitetsvakt" />
							<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse" id="navbarSupportedContent">
								<ul className="navbar-nav mr-auto">
									<li className="nav-item">
										<NavLink exact to='/homepage' className="nav-link">Aktuelt <span className="sr-only">(current)</span></NavLink>
									</li>
									<li className="nav-item">
										<NavLink exact to='/calendar' className="nav-link" href="#">Kalender</NavLink>
									</li>
									<li className="nav-item dropdown">
										<NavLink exact to='/events' className="nav-link dropdown-toggle" href="arrangementer.html" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											Arrangementer
										</NavLink>
										<div className="dropdown-menu" aria-labelledby="navbarDropdown">
										<NavLink exact to='/events' className="dropdown-item" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									 Kommende
											</NavLink>
										 <NavLink exact to='/earlierevents' className="dropdown-item" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										 Tidligere
										</NavLink>
										</div>
									</li>
									<li className="nav-item">
										<NavLink exact to='/contact' className="nav-link" href="#">Om oss</NavLink>
									</li>
									<li className="nav-item dropdown">
										<NavLink exact to='/profile' className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											Profil
										</NavLink>
										<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
										<NavLink exact to='/loggut' onClick = {() => {
											userService.emptystorage();
										}}>
											Logg ut
										</NavLink>
										</div>
									</li>
									<li className="nav-item">
										<NavLink exact to='/search' className="nav-link" href="#">Brukersøk</NavLink>
									</li>
									<div ref="adminside">
									<li>
									<NavLink exact to='/admin' className="nav-link" href="#">Admin</NavLink>
									</li>
									</div>
								</ul>
							</div>
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
	componentDidMount() {
		this.userisloggedin = userService.browseruser();
		if (this.userisloggedin) {
			if (this.userisloggedin.admin !== 1) {
					this.refs.adminside.hidden = true;
			}
	}
	this.forceUpdate();
	}
}

class Profile extends React.Component{
	constructor() {
		super();
		this.userisloggedin
	}
	render(){
		return(
			<div>
				<h1></h1>
				<span ref='userName'></span><br />
				<span ref='userEmail'></span><br />
				<span ref='userPoints'></span><br />
				Kommende arrangementer:<br />
				<span ref='upcomingEvents'></span>
				tidligere deltatt arangementer:<br />
				<span ref="earlierevents"></span>
				<span ref="usercompetence"></span>
				<button ref='btnShowInfo'>Vis info</button>
				<button onClick = {() => {
					history.push('/editprofile/'),
					redid = viewid;
					this.forceUpdate()}}>Rediger</button><br />
					<span ref="passive"></span>
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

	componentWillUnmount() {
		viewid = 0;
	}

	componentDidMount(){

		userService.userHasCompetence(userid, (result) => {
			console.log(result)
		})

		userService.getEarlierUserEvents(userid, (result) => {
			for (let event of result) {
				this.refs.earlierevents.innerText += event.name + '\n';
			}
		})

		userService.getUpcomingEvents(viewid ? viewid : userid,(result) => {
			for(let event of result){
				this.refs.upcomingEvents.innerText += event.name + '\n';
			}
		})
		this.userisloggedin = userService.browseruser();
		userid = this.userisloggedin.userID;

		userService.checkifPassive(userid, (result) => {
			let str; let string; let array;
			if (result != undefined) {

				this.refs.passive.innerText = result.date_End;

				str = result.date_End;
				if (str) {
					string = str.toString();
					array = string.split(" ");
					this.refs.passive.innerText = "Du er fortsatt passiv til " + array[2]+" "+array[1]+" "+array[3];
				}
			}
		})

 		userService.getUser(userid, (result) => {
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
		}
	}

class EditOtherProfile extends React.Component{
		constructor() {
			super();
			this.userisloggedin
		}
		render(){
			return(
				<div>
					<h1></h1>
					brukerid: <span ref="medlemsnummer"></span><br/>
					<span ref='userName'></span><br />
					<span ref='userEmail'></span><br />
					<span ref='userPoints'></span><br />
					Kommende arrangementer:<br />
					<span ref='upcomingEvents'></span>
					<button ref='btnShowInfo'>Vis info</button>
					<button onClick = {() => {
						history.push('/editprofile/'),
						redid = viewid;
						this.forceUpdate()}}>Rediger</button>
					<button ref='btnDeactivate'>Deaktiver</button>
					<button onClick = {() => {
						history.push('/competence/'),
						redid = viewid;
						this.forceUpdate()}}>Kompetanse</button><br />
						<span ref="passive"></span>
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
			userService.getUpcomingEvents(viewid ? viewid : userid,(result) => {
				for(let event of result){
					this.refs.upcomingEvents.innerText += event.name + '\n';
				}
			})
			this.userisloggedin = userService.browseruser();
			userid = this.userisloggedin.userID;

			userService.checkifPassive(viewid, (result) => {
				let str; let string; let array;
				if (result != undefined) {

					this.refs.passive.innerText = result.date_End;

					str = result.date_End;
					if (str) {
						string = str.toString();
						array = string.split(" ");
						this.refs.passive.innerText = "Brukeren er passiv til " + array[2]+" "+array[1]+" "+array[3];
					}
				}
			})

	 		userService.getUser(viewid ? viewid : userid, (result) => {
				let btnShowInfoPressed = false;
				this.refs.medlemsnummer.innerText = result.userID;
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
					userService.deactivateUser(viewid,(result) => {
						console.log('Deaktivert bruker - ID:' + viewid);
						// history.push('/loginPage/');
						// this.forceUpdate();
						});
					}
				}
			}
		}

class EditProfile extends React.Component{
	constructor() {
		super();
		this.userisloggedin
	}
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

		this.userisloggedin = userService.browseruser();
		userid = this.userisloggedin.userID;

			userService.getUser(redid ? redid : userid,(result) => {
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
	componentWillUnmount() {
		redid = null;
	}
}

class Competence extends React.Component{
	constructor() {
		super();
		this.userisloggedin;
	}
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
		this.userisloggedin = userService.browseruser();
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
				userService.regCompetence(redid, compid, finished, (result) => {
					console.log(compid);
					history.push('/EditOtherProfile');
				})
			})
			this.forceUpdate(); // Skriv en tekst her om at det er sendt til godkjenning
		}
		userService.getUserComp(redid ? redid: userid, (result) => {
			for (let usercomp of result){
				this.refs.compOutput.innerText += usercomp.title + '\n';
			}
		})
	}
}

class Homepage extends React.Component {
	render(){
		return(
			<div>
				<div className="grid-container">
					<div className="main-wrap">
						<h1 className="title">Aktuelle saker</h1>
						<div className="news-left-grid">
						<div className="news-image-grid">
							<div>
								<img className="news-image" src="jemen.jpg" alt="" />
							</div>
							<div>
								<img className="news-image" src="jemen.jpg" alt="" />
							</div>
							<div>
								<img className="news-image" src="jemen.jpg" alt="" />
							</div>
							<div>
								<img className="news-image" src="jemen.jpg" alt="" />
							</div>
							<div>
								<img className="news-image" src="jemen.jpg" alt="" />
							</div>
						</div>
						<div className="news-text-grid">
						<div className="news-text">
							<h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
							<p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann
								og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
						</div>
						<div className="news-text">
							<h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
							<p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann
								og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
						</div>
						<div className="news-text">
							<h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
							<p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann
								og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
						</div>
						<div className="news-text">
							<h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
							<p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann
								og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
						</div>
						<div className="news-text">
							<h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
							<p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann
								og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
						</div>
					</div>
					</div>
					</div>
					<div>
					<div className="news-right-top">
							<img className="aktueltprofilbilde" src="profilepicture.jpg" alt="" />
							<p className="aktueltprofiltekst">Per Ole Finsnes</p>
							<p className="aktueltprofiltekst">Vaktpoeng: 14</p>
						</div>
						<div className="news-right-bottom">
							<h3 className="mellomtittel">Kommende arrangementer</h3>
							<div className="aktueltarrangementer">
								<a href="#">Trønderfest</a>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
							<div className="aktueltarrangementer">
								<a href="#">Trønderfest</a>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
							<div className="aktueltarrangementer">
								<a href="#">Trønderfest</a>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
							<div className="aktueltarrangementer">
								<a href="#">Trønderfest</a>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class EarlierEvents extends React.Component {
		render(){
			return(
				<div>
					<h1>Arrangementer</h1>
					<h4>Tidligere arrangementer</h4>
					<div ref='earlier'></div>
				</div>
			);
		}
		componentDidMount(){
			userService.getEarlierEvents((result) => {
				for(let event of result){
					let divEvent = document.createElement('DIV');

					divEvent.innerText = event.name + '\n' +
						'Lokasjon: ' + event.area + '\n' +
						'Kontakttelefon: ' + event.contact_phone + '\n';

					this.refs.earlier.appendChild(divEvent);
					divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
				}
			})
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
		userService.getUpcomingevents((result) => {
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
			<div className="big-container">
				<div className="about-bg">
					<h2 className="title">Lokalforeninger i Trondheimsområdet</h2>

					<div className="about-container">
					<div>
						<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1785.8060229100615!2d10.414399016240537!3d63.410782283268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x466d31c71f115b5d%3A0x5273344a7d7ea94a!2sTrondheim+R%C3%B8de+Kors!5e0!3m2!1sno!2sno!4v1523533302113"
						width="500" height="300" frameBorder="0" style={{border:0}} allowFullScreen></iframe>
						<div className="abouttext">
							<h3 className="aboutmediumtitle">Trondheim Røde Kors</h3>
							<p className="aboutbreadtext">Med over 1000 frivillige og flere enn 20 aktiviteter er vi til stede for andre mennesker og sårbare grupper i byen vår.</p>
						</div>

							<div>
						<div className="aboutflex">
							<div className="abouttext2">
								<h4 className="aboutmediumtitle">Adresse</h4>
							</div>
							<div className="abouttext2">
								<h4 className="aboutmediumtitle">Telefon</h4>
							</div>
							<div className="abouttext2">
								<h4 className="aboutmediumtitle">Epost</h4>
							</div>
						</div>
						<div className="aboutflex">
							<div className="abouttext2">
								<div className="abouttext3">
									<p>Nardoveien 4 B 7032 Trondheim</p>
								</div>
							</div>
							<div className="abouttext2">
								<div className="abouttext3">
									<p>73 94 93 00</p>
								</div>
							</div>
							<div className="abouttext2">
								<div className="abouttext3">
									<p>post@trondheim-redcross.no</p>
								</div>
							</div>
						</div>
					</div>
					</div>

					<div>
						<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1785.4153630771596!2d10.774810216042496!3d63.41705568381125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x466d3c5135aa3aef%3A0xf02afa00572e3186!2sHesttr%C3%B8a+1%2C+7550+Hommelvik!5e0!3m2!1sno!2sno!4v1523533990024"
						width="500" height="300" frameBorder="0" style={{border:0}} allowFullScreen></iframe>
						<div className="abouttext">
							<h3 className="aboutmediumtitle">Malvik Røde Kors</h3>
							<p className="aboutbreadtext">I over 73 år har Malvik Røde Kors og våre frivillige stilt opp for å hjelpe til i lokalsamfunnet. Det tenker vi å fortsette med, og da trenger vi flere frivillige.</p>
						</div>

						<div>
							<div className="aboutflex">
								<div className="abouttext2">
									<h4 className="aboutmediumtitle">Adresse</h4>
								</div>
								<div className="abouttext2">
									<h4 className="aboutmediumtitle">Telefon</h4>
								</div>
								<div className="abouttext2">
									<h4 className="aboutmediumtitle">Epost</h4>
								</div>
							</div>
							<div className="aboutflex">
								<div className="abouttext2">
									<div className="abouttext3">
										<p>Hesttrøa 1 <br /> 7550 Hommelvik</p>
									</div>
								</div>
								<div className="abouttext2">
									<div className="abouttext3">
										<p>73 94 93 45</p>
									</div>
								</div>
								<div className="abouttext2">
									<div className="abouttext3">
										<p>malvik@strk-redcross.no</p>
									</div>
								</div>
							</div>
							</div>
					</div>
					</div>
				</div>
			</div>
			</div>
		);
	}
}

class EditEvent extends React.Component {
	render(){
		return(
			<div>
			<form>
			<h1>Rediger arrangement </h1>
				<label>
					Navn på arrangementet:<br />
					<input ref='editArrName' type='text' /><br />
				</label>
				<label>
					Startdato:<br />
					<input ref='editStartDato' type='datetime-local' /><br />
				</label>
				<label>
					sluttdato:<br />
					<input ref='editSluttDato' type='datetime-local' /><br />
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
					Møtested:<br />
					<input ref='editMeet' type='text' /><br />
				</label>
				<label>
					description:<br />
					<input ref='editDescript' type='text' /><br />
				</label>
			</form>
			<button ref='btneditArr'>Rediger Arrangement</button>
		</div>

	)}

	componentDidMount() {
		userService.getDivEvent(eventID,(result) => {
					this.refs.editArrName.value = result.name;
					this.refs.editStartDato.valueAsNumber = result.date_start.getTime();
					this.refs.editSluttDato.valueAsNumber = result.date_end.getTime();
					this.refs.editTlf.value = result.contact_phone;
					this.refs.editRoles.value = result.rolelist_roleID;
					this.refs.editMeet.value = result.area;
					this.refs.editDescript.value = result.description;
		})
		this.refs.btneditArr.onclick = () => {
			var newName = this.refs.editArrName.value;
			var newStartDato = this.refs.editStartDato.value;
			var newEndDato = this.refs.editSluttDato.value;
			var newTlf = this.refs.editTlf.value;
			var newrolelist = this.refs.editRoles.value;
			var newMeet = this.refs.editMeet.value;
			var newDesc = this.refs.editDescript.value;

			userService.editArr(eventID, newName, newStartDato, newEndDato, newTlf, newrolelist, newMeet, newDesc, (result) => {
			})
			console.log('Oppdatert Arrangement:');
			alert('Arrangemenetet ble oppdatert');
			history.push('/divevent/');
			this.forceUpdate();
		}
	}

}

class divEvent extends React.Component {
	constructor() {
		super();
		this.userisloggedin;
	}
	render() {
		return(
			<div>
			<h1>Valgt arrangement: </h1> <br />
			arrangementets navn: <span ref='eventName'></span><br />
			Startdato: <span ref='eventstartdate'></span><br />
			Sluttdato: <span ref='eventsluttdate'></span><br />
			Møtested: <span ref='eventmøtested'></span><br />
			Kontaktinfo: <span ref='kontaktinfo'></span><br />
			rolleliste: <span ref='rolelist'></span><br />
			Beskrivelse: <br /> <span ref='eventinfo'></span><br /> <br />
			<button ref='editArr'>Rediger</button>
			<button ref='Interested'>Interresert</button>
			<button ref='checkinterested'>Sjekkinterreserte medlemmer</button><br />
			<span ref="hasevent"></span>
			</div>
		)
	}

	componentDidMount() {
		this.userisloggedin = userService.browseruser();
		if (this.userisloggedin.admin !== 1) {
			this.refs.checkinterested.hidden = true;
			this.refs.editArr.hidden = true;
		}
		let str; let string; let array;

		userService.getDivEvent(eventID,(result) => {
					this.refs.eventName.innerText = result.name;
					this.refs.eventstartdate.innerText = result.date_start;
					this.refs.eventsluttdate.innerText = result.date_end;
					this.refs.eventinfo.innerText = result.description;
					this.refs.eventmøtested.innerText = result.area;
					this.refs.kontaktinfo.innerText = result.contact_phone;
					this.refs.rolelist.innerText = result.rolelist_roleID;

					str = result.date_start;
          if (str) {
            string = str.toString();
            array = string.split(" ");
            this.refs.eventstartdate.innerText = array[2]+" "+array[1]+" "+array[3]+" "+array[4];
          }
					str = result.date_end;
					if (str) {
						string = str.toString();
						array = string.split(" ");
						this.refs.eventsluttdate.innerText = array[2]+" "+array[1]+" "+array[3] + " " + array[4];
					}
					this.refs.Interested.onclick = () => {
					userService.addInterested(eventID, userid, (result) => {
						alert('Du er meldt interresert');
						this.refs.Interested.disabled = true;
						this.forceUpdate();
					})
			}
			userService.checkifInterested(eventID, userid, (result) => {
				if (result != undefined) {
					this.refs.Interested.disabled = true;
					this.forceUpdate();
				}
			})
			userService.checkifUserHasEvent(eventID, userid, (result) => {
				if (result != undefined) {
					this.refs.Interested.hidden = true;
					this.refs.hasevent.innerText = "Du er meldt på dette arrangementet";
					this.forceUpdate();
				}
			})
		})
		this.refs.editArr.onclick = () => {
			history.push('/editevent/');
			this.forceUpdate();
		}
		this.refs.checkinterested.onclick = () => {
			history.push('/vaktliste/');
		}
	}
	}

class Vaktliste extends React.Component {
	constructor() {
		super();
		this.state = {
		users: '',
		userhasevent: '',
	}
		this.update = "";
		this.hasevent = "";
	}
		render() {
			return(
			<div>
			<h1> Påmeldte medlemmer </h1>
			<ul>
			{this.state.userhasevent ? this.state.userhasevent:'Ingen påmeldte'}
			</ul>
			<h1> Interreserte medlemmer </h1>
			<ul>
			{this.state.users ? this.state.users:'Ingen Interreserte'}
			</ul>
			</div>
		)
	}

		deleteuser(userid) {
		userService.deleteInterested(eventID, userid, (result) => {
		userService.getInterested(eventID, userid, (result) => {
			this.update = result;
			this.jodajoda();
				})
			})
		}

		deletefromvakt(userid) {

		}

		addUser(userid) {
			userService.addUserHasEvent(userid, eventID, (result) => {
				userService.getUserHasEvent(userid, eventID, (result) => {
					this.hasevent = result;
					this.hentbrukere();
				})
			})
		}

		hentbrukere() {
			var pameldte = [];

			for (let user of this.hasevent) {
			pameldte.push(
				<li key = {user.userID}>
				<Link onClick = {() => {
					viewid = user.userID;
				}} to={'/editotherprofile/'}>
				{
					user.firstname + " " + user.lastname
				}
				</Link>

				</li>
			)
		}

		this.setState ({userhasevent:pameldte})
		}

	jodajoda()  {
	var int = [];

	for (let user of this.update) {
		int.push(
			<li key = {user.userID}>
			{user.firstname}
			<button onClick = {() => {
				this.addUser(user.userID)
				this.deleteuser(user.userID)
			}}>aksepter</button>
			<button onClick = {() => {
				this.deleteuser(user.userID)
					}}>deny</button>
				</li>
			)
		}
		this.setState ({users:int})
	}

	componentDidMount() {
			userService.getInterested(eventID, userid, (result) => {
				this.update = result;
				this.jodajoda();
			})
			userService.getUserHasEvent(userid, eventID, (result) => {
				this.hasevent = result;
				this.hentbrukere();
			})
		}
	}

class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		events:[],
		}
		this.userisloggedin;
	}
	setArrinfo(event) {
		var title = event.title;
		var datestart = event.startDate;
		var dateend = event.endDate;
		eventID = event.eventID;

		userService.getEvent((result) => {
			eventID = event.eventID;
		this.setState({events: result});
		history.push('/divEvent/');
	})

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
											onSelectEvent={event => this.setArrinfo(event)}
										/>
										<div>
										<button ref='CreateEvent'>Lag nytt arrangement</button>
										<button ref="Passiv">Vær kjempe passiv</button>
										</div>
										</div>
		);
	}
	componentDidMount() {
		this.userisloggedin = userService.browseruser();
		if (this.userisloggedin.admin !== 1) {
			this.refs.CreateEvent.hidden = true;
		}
		this.refs.CreateEvent.onclick = () => {
			history.push('/nyttEvent/');
			this.forceUpdate();
		}
		this.refs.Passiv.onclick = () => {
			history.push('/passiv/');
			this.forceUpdate();
		}
	}
	componentWillMount() {
			userService.getEvent((result) => {
				console.log(result)
				// eventID = result[0].eventID;
			this.setState({events: result});
			this.forceUpdate();
		})
	}
	}

class Administrator extends React.Component {
	constructor () {
		super();
		this.state = {
			brukergodkjenning: '',
			mannskapsliste: '',
		}
		this.brukere = '';
		this.liste = '';
		}

	render() {
	return (
		<div>
		<h2>Adminsiden</h2>
		<h3> Ikke Godkjente brukere </h3>
		<ul>
		{this.state.brukergodkjenning ? this.state.brukergodkjenning:'Alle brukere er aktivert'}
		</ul>
		<h3> roller </h3>
		<ul>
		{this.state.mannskapsliste}
		</ul>
		<button ref="newrole">Lag ny rolle</button>
		</div>
		)
	}

	updateuser(userid) {
	let	inactive = 0;
		userService.changeUser(inactive, userid, (result) => {
		userService.getInactiveUsers(userid, (result) => {
				this.brukere = result;
				this.skrivutinfo();
			})
		})
	}

	skrivutmannskapsinfo() {
		let mannskap = [];
		for(let rolelist of this.liste) {
			mannskap.push(
				<li key={rolelist.rolelistID}>
				{rolelist.name}
				<button onClick = {() => {
					history.push('/changerole')
					rolelistID = rolelist.rolelistID;
				}}>Rediger</button>
				</li>
			)
		}
		this.setState ({mannskapsliste: mannskap})
	}

	skrivutinfo() {
		let utskrift = []
		for (let user of this.brukere) {
			utskrift.push(
				<li key = {user.userID}>
				{user.firstname + " " + user.lastname}
				<button onClick = {() => {
					this.updateuser(user.userID)
				}}>aksepter</button>
					</li>
				)
		}
		this.setState ({brukergodkjenning: utskrift})
	}

	componentDidMount() {
		this.refs.newrole.onclick = () => {
			history.push('/makenewrole/')
		}
		userService.getInactiveUsers(userid, (result) => {
			console.log(result)
			this.brukere = result;
			this.skrivutinfo();
		})
		userService.getRolelists((result) => {
			this.liste = result;
			this.skrivutmannskapsinfo();
		})
	}
	}

class NewRole extends React.Component {
	render(){
				return(
					<div>
						<h1>Ny Role</h1>
						<form>
							<label>
								Navn på rollen:<br />
								<input ref='NewRoleName' type='text' /><br />
							</label>
							<label>
								Beskrivelse av rollen:<br />
								<input ref='NewRoleDesc' type='text' /><br />
							</label>
						</form>
						<button ref='btnSendRole'>Registrer</button>
						<button ref='btnBackRole'>Tilbake</button>
					</div>
				)
			}
			componentDidMount() {
				this.refs.btnBackRole.onclick = () => {
					history.push('/admin/');
				}

				this.refs.btnSendRole.onclick = () => {
					let name = this.refs.NewRoleName.value;
					let description = this.refs.NewRoleDesc.value;

						userService.addRole(name, description, (result) => {
							console.log('Arrangementet er opprettet');
							history.push('/admin/');
							this.forceUpdate();
					})
				}
		}
}

class ChangeRole extends React.Component {
	constructor() {
		super();
	}

	render() {
		return(
			<div>
			<h1> hei </h1>
			<label>
				Navn på rollen:<br />
				<input ref='editRoleName' type='text' /><br />
			</label>
			<label>
				description:<br />
				<input ref='editDescription' type='text' /><br />
			</label>
			<button ref="EditRole">Rediger</button>
			<button ref="back">Gå tilbake</button>
			</div>
		)
	}
	componentDidMount() {
		userService.getThisRoleList(rolelistID, (result) => {
			this.refs.editRoleName.value = result.name;
			this.refs.editDescription.value = result.description;
		})
		this.refs.EditRole.onclick = () => {
			var editname = this.refs.editRoleName.value;
			var editDescription = this.refs.editDescription.value;

			userService.editRole(rolelistID, editname, editDescription, (result) => {
			})
				console.log('rollen ble oppdatert');
				history.push('/admin/')
		}
		this.refs.back.onclick = () => {
			history.push('/admin/')
		}
	}
}

class Passiv extends React.Component {
		render() {
			return (
				<div>
				<h1> Velg passiv dato </h1>
				<form>
				<label>
					Startdato:<br />
					<input ref='passivdato' type='date' /><br />
				</label>
				<label>
					sluttdato:<br />
					<input ref='passivenddato' type='date' /><br />
					</label>
					</form>
				<button ref="passivbutton"> vær kjempe passiv</button>
				</div>
			);
		}
		componentDidMount() {

			this.refs.passivbutton.onclick = () => {
			var userID = userid;
			var date_Start = this.refs.passivdato.value;
			var date_End = this.refs.passivenddato.value;

			userService.getUser(userid, (result) => {
				userService.addPassive(userid, date_Start, date_End, (result) => {
					alert ('Du er lagt passiv mellom ' + date_Start + " til " + date_End)
					history.push('/calendar/');
				})
			})
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
									Vaktlag:<br />
										<select ref='rolelistSelect'>
										</select><br />
								</label>
								<label>
									description:<br />
									<input ref='regDescript' type='text' /><br />
								</label>
								<label>
									Møtested:<br />
									<input ref='regMeet' type='text' /><br />
								</label>
								<label>
									Vaktpoeng:<br />
									<input ref='regPoints' type='number' /><br />
								</label>
							</form>
							<button ref='btnSendArr'>Registrer</button>
							<button ref='btnBackArr'>Tilbake</button>
						</div>
					)
				}
				componentDidMount() {
					let rolelistid = 0;
					userService.getRolelists((result) => {
						for(let rolelist of result){
							let rolelistSel = document.createElement('OPTION');
							let rolelistName = document.createTextNode(rolelist.name);

							rolelistSel.appendChild(rolelistName);
							this.refs.rolelistSelect.appendChild(rolelistSel);
						}
					})

					this.refs.btnBackArr.onclick = () => {
						history.push('/events/');
						this.forceUpdate();
					}

					this.refs.btnSendArr.onclick = () => {
					 	let name = this.refs.regArrName.value;
						let date_start = this.refs.regStartDato.value;
						let date_end = this.refs.regSluttDato.value;
						let contact_phone = this.refs.regTlf.value;
						let description = this.refs.regDescript.value;
						let area = this.refs.regMeet.value;
						let point_award = this.refs.regPoints.value;

						let rolelistName = this.refs.rolelistSelect.value;

						userService.getRolelist(rolelistName,(result) => {
							rolelistid = result.rolelistID;

							userService.addEvent(name, date_start, date_end, contact_phone, rolelistid, description, area, point_award, (result) => {
								alert('Arrangementet er opprettet');
								history.push('/events/');
								this.forceUpdate();
						})
					})
				}
			}
		}

class Search extends React.Component {
	constructor() {
		super();
		this.userisloggedin
	}
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
				this.userisloggedin = userService.browseruser();

				this.refs.btnSearch.onclick = () => {
					let keyword = this.refs.searchField.value;

					userService.search(keyword, (result) => {
						this.refs.output.innerText = '';

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
								if (this.userisloggedin.admin == 1) {
								divUser.appendChild(btnUser);
							}
								this.refs.output.appendChild(divUser);
							}
							})

							function sendToUser(id){
								viewid = id;
										history.push('/editotherprofile/',);
									}
					}
				}
			}

ReactDOM.render((
  <HashRouter>
    <div>
		<Navbar />
      <Switch>
				<Route exact path='/makenewrole' component={NewRole}/>
				<Route exact path='/changerole' component={ChangeRole}/>
				<Route exact path='/editotherprofile' component={EditOtherProfile}/>
				<Route exact path='/admin' component={Administrator}/>
				<Route exact path='/passiv' component={Passiv}/>
				<Route exact path='/forgotPassword' component={ForgotPassword}/>
				<Route exact path='/vaktliste' component={Vaktliste}/>
				<Route exact path='/editevent' component={EditEvent}/>
				<Route exact path='/divevent' component={divEvent}/>
				<Route exact path='/nyttEvent' component={NewEvent}/>
				<Route exact path='/homepage' component={Homepage}/>
				<Route excat path='/loginPage' component={LoginPage}/>
				<Route excat path='/register' component={Register}/>
				<Route excat path='/calendar' component={Calendar}/>
				<Route exact path='/profile' component={Profile}/>
				<Route excat path='/editprofile' component={EditProfile}/>
				<Route exact path='/earlierevents' component={EarlierEvents}/>
				<Route excat path='/events' component={Events}/>
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
