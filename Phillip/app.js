import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
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
			<div>

			<link rel="stylesheet" type="text/css" href="nav.css" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" />
			<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet" />
			<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossOrigin="anonymous"></script>
			<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossOrigin="anonymous"></script>
			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
			<meta charSet="utf-8" />
			<title>Røde Kors Sanitetsvakt</title>

			<div className="login-body">
			<div className="container">
	<div className="login-wrap">
	<div>
		<div  className="login-logo">
		<img className="login-logo-img" src="rodekors-01.png" alt="Logo" />
		</div>
	<form>
		<div className="form-group">
			<label className="login-text">Epost:</label>
			<input type="text" className="form-control" id="usr" ref='inpUser' />
		</div>
		<div className="form-group">
			<label className="login-text">Passord:</label>
			<input type="password" className="form-control" id="pwd" ref='inpPassword' />
		</div>
	</form>
	<div className="login-grid">
		<div>
			<NavLink exact to='/forgotPassword' className="nav-link">Glemt passord?</NavLink> <br />
			<NavLink exact to='/register' className="nav-link">
				Registrere ny bruker?
			</NavLink>
		</div>
		<div>
			<button id="login-button" type="button" className="btn btn-danger" ref='btnLogin'>Logg inn</button>
		</div>
		<div ref='loginOutput'></div>
			</div>
		</div>
		</div>
		</div>
		</div>
	</div>

		);
	}
	componentDidMount(){
		this.refs.btnLogin.onclick = () => {
				let inpUser = this.refs.inpUser.value;
				let inpPassword = this.refs.inpPassword.value;
				let email = this.refs.inpUser.value;
				userService.emptystorage();
				userService.getThisUser(email, (result) => {
					console.log(result)
					let inactive = result.inactive;
					userService.emptystorage();
					userService.checkIfUserIsInactive(email, inactive, (result) => {
						if (inactive == 1) {
							this.refs.loginOutput.innerText = 'Brukeren er ikke aktivert, kontakt administator';
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
						history.push('/homepage');
					}else {
						console.log("mislykket innlogging");
						this.refs.loginOutput.innerText = 'feil brukernavn/passord';
						userService.emptystorage();
						this.forceUpdate();
					}
	})
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
					<button ref="back">Back</button>
				</div>
			)
		}
		componentDidMount(){
			this.refs.sendPass.onclick = () => {
				'use strict';
				const nodemailer = require('nodemailer');

				// Generate test SMTP service account from ethereal.email
				// Only needed if you don't have a real mail account for testing
				nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'rodekorstest123@gmail.com', // generated ethereal user
            pass: 'rodekors11' // generated ethereal password
        }
    });
		userService.getThisUser(email, (result) => {
			console.log(result);
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Rodekors" <rodekorstest123@gmail.com>', // sender address
        to: 'phillipaur@gmail.com, phillipaur@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    	});
		});
	});
		}
		this.refs.back.onclick = () => {
			history.push('/loginPage');
			this.forceUpdate();
		}
	}
}

class Register extends React.Component {
	render(){
			return(

				<div className="login-body">

      <div className="container">
        <div className="login-wrap-reg">
        <div>
          <div className="login-logo">
          <img className="login-logo-img" src="rodekors-01.png" alt="Logo" />
          </div>
        <form>
          <div className="login-grid">
          <div className="form-group">
            <label className="login-text">Fornavn:</label>
            <input type="text" className="form-control" ref='regFirstName' />
            <label className="login-text">Adresse:</label>
            <input type="text" className="form-control" ref='regAddress' />
            <label className="login-text">By:</label>
            <input type="text" className="form-control"  ref='regCity' />
            <label className="login-text">Epost:</label>
            <input type="email" className="form-control" ref='regEmail' />
            <label className="login-text">Passord:</label>
            <input type="password" className="form-control" ref='regPassword' />
          </div>
          <div className="form-group">
            <label className="login-text">Etternavn:</label>
            <input type="text" className="form-control" ref='regLastName' />
            <label className="login-text">Telefon:</label>
            <input type="text" className="form-control" ref='regPhone' />
            <label className="login-text">Postnr:</label>
            <input type="number" className="form-control" ref='regZip' />
            <label className="login-text">Alder:</label>
            <input type="number" className="form-control" ref='regAge' />
            <label className="login-text">Bekreft passord:</label>
            <input type="password" className="form-control" ref='repeatregPassword' />
          </div>
          </div>
        </form>
        <div className="login-grid">
          <div>
            <NavLink exact to='/loginPage'>Logg inn?</NavLink> <br />
            <NavLink exact to='/forgotpassword'>Glemt passord?</NavLink>
          </div>
          <div>
						<span ref="feilmelding"></span> <br />
						<button id='login-button' type="button" className="btn btn-danger" ref='btnSendReg'>Registrer</button>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>


			)
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
		if(this.userisloggedin && this.userisloggedin.admin == 1){
			if (this.userisloggedin.admin == 1) {
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
										<NavLink exact to='/homepage' className="nav-link">Aktuelt<span className="sr-only">(current)</span></NavLink>
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
										</div>
									</li>
									<li className="nav-item">
										<NavLink exact to='/search' className="nav-link" href="#">Brukersøk</NavLink>
									</li>
									<li>
									<NavLink exact to='/admin' className="nav-link" href="#">Admin</NavLink>
									</li>
									<li>
									<NavLink exact to='/loggut' className="nav-link" onClick = {() => {
										userService.emptystorage();
										history.push('/loginPage/')
									}}>
										Logg ut
									</NavLink>
									</li>
								</ul>
							</div>
					</nav>
				</div>
			);
		}
		}else if (this.userisloggedin){
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
										</li>
									<li className="nav-item">
										<NavLink exact to='/search' className="nav-link" href="#">Brukersøk</NavLink>
									</li>
									<li>
									<NavLink exact to='/loggut' className="nav-link" onClick = {() => {
										userService.emptystorage();
										history.push('/loginPage/')
									}}>
										Logg ut
									</NavLink>
									</li>
								</ul>
							</div>
					</nav>
				</div>
			)
		} else {
			return null;
		}
	}
	componentDidMount() {
		this.userisloggedin = userService.browseruser();
	}
}

class Profile extends React.Component{
	constructor() {
		super();
		this.userisloggedin
	}
	render(){
		return(
				<div className="grid-container">
				<div>

    <div className="profile-events">
      <div className="profile-events-grid">
    <div>
      <h3 className="medium-title">Kommende vakter</h3>
      <div className="profile-events-minor-grid">

				<div ref='upcoming'></div>

			</div>
    </div>
    <div>
      <h3 className="medium-title">Deltatte vakter</h3>
      <div className="profile-events-minor-grid">
        <div>

				<div ref='earlierevents'></div>

        </div>
      </div>
    </div>
      </div>
    </div>


			<div className="profile-course-registration">
				<h2 className="medium-title">Registrere kurs?</h2>
				<div>
					<p>Hvilken kvalifisering gjelder det:</p>
					<form ref='compForm'>
						<select ref='compSelect'>
						</select>
					</form>
					<button ref='btnAddComp'>Send inn</button>
					<div ref='compOutput'></div>
				</div>
			</div>
		</div>

  <div>
  <div>
    <div className="profile-bg">
      <h3 className="medium-title">Personalia</h3>
      <img className="profile-picture" src="profilepicture.jpg" alt="" />
      <p className="profile-text" ref='userName'></p>
      <p className="profile-text" ref='userPoints'>Vaktpoeng:</p>
      <p className="profile-text" ref='userAge'>Alder:</p>
      <p className="profile-text" ref='userAddress'>Adresse:</p>
      <p className="profile-text" ref='userZip'>Postnr:</p>
      <p className="profile-text" ref='userPhone'>Telefon:</p>
      <p className="profile-text" ref='userEmail'>Epost:</p>
			<p className="profile-text" ref='passive'></p>
			<button onClick = {() => {
				history.push('/editprofile/'),
				this.forceUpdate()}}>Rediger</button>
		</div>
  </div>

    <div>
        <div className="profile-deactivate">
          <h3 className="medium-title">Deaktivere profil?</h3>
          <p>Ønsker du av en grunn å deaktivere din profil kan du klikke på knappen under, Profilen din vil da bli deaktivert og du må kontakte administrator for å aktivere den igjen.</p>
          <button type="button" ref='btnDeactivate'>Ja, jeg ønsker å deaktivere min profil</button>
        </div>
    </div>
  </div>
			</div>
		);
	}
	componentDidMount(){

		this.userisloggedin = userService.browseruser();
		userid = this.userisloggedin.userID;
		let str; let string; let array; let stri;
		userService.checkifPassive(userid, (result) => {
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

		let compid = 0;

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
				userService.regCompetence(userid, compid, finished, (result) => {
					console.log(compid);
					this.forceUpdate();
				})
			})
			 // Skriv en tekst her om at det er sendt til godkjenning
		}
		userService.getUserComp(userid, (result) => {
			for (let usercomp of result){
				this.refs.compOutput.innerText += usercomp.title + '\n';
			}
		})

		userService.getEarlierUserEvents(userid, (result) => {
			for (let event of result){
				let divEvent = document.createElement('DIV');
					divEvent.className = 'aktueltarrangementer';

				let btnEvent = document.createElement('BUTTON');
				let btnEventTxt = document.createTextNode('Informasjon');
				let clickedEvent = event.eventID;

				btnEvent.appendChild(btnEventTxt);
				btnEvent.setAttribute('id', event.eventID);

				let titleEvent = document.createElement('span');
				// titleEvent.setAttribute('href', '/#');
				titleEvent.className = "blueTxt";
				titleEvent.innerText = event.name;


				btnEvent.onclick = () => {
					sendToEvent(clickedEvent);
				}

				divEvent.appendChild(titleEvent); //Fiks men lag en p for info

				let eventTxt = document.createElement('P');

				str = event.date_start;
				if (str) {
					string = str.toString();
					array = string.split(" ");
					str = array[2]+" "+array[1]+" "+array[3]+" "+array[4];
				}

				eventTxt.innerText += '\n' +
					'Lokasjon: ' + event.area + '\n' +
					'Kontakttelefon: ' + event.contact_phone + '\n' +
					'Startdato: ' + str;

				divEvent.appendChild(eventTxt);

				// divEvent.appendChild(btnEvent);
				this.refs.earlierevents.appendChild(divEvent);
				// divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
		}
		})

		userService.getUpcomingEvents(userid, (result) => {
				for(let event of result){
					let divEvent = document.createElement('DIV');
						divEvent.className = 'aktueltarrangementer';

					let btnEvent = document.createElement('BUTTON');
					let btnEventTxt = document.createTextNode('Informasjon');
					let clickedEvent = event.eventID;

					btnEvent.appendChild(btnEventTxt);
					btnEvent.setAttribute('id', event.eventID);

					let titleEvent = document.createElement('span');
					// titleEvent.setAttribute('href', '/#');
					titleEvent.className = "blueTxt";
					titleEvent.innerText = event.name;


					btnEvent.onclick = () => {
						sendToEvent(clickedEvent);
					}

					divEvent.appendChild(titleEvent); //Fiks men lag en p for info

					let eventTxt = document.createElement('P');

					stri = event.date_start;
					if (stri) {
						string = stri.toString();
						array = string.split(" ");
						stri = array[2]+" "+array[1]+" "+array[3]+" "+array[4];
					}

					eventTxt.innerText += '\n' +
						'Lokasjon: ' + event.area + '\n' +
						'Kontakttelefon: ' + event.contact_phone + '\n' +
						'Startdato: ' + stri;



					divEvent.appendChild(eventTxt);

					// divEvent.appendChild(btnEvent);
					this.refs.upcoming.appendChild(divEvent);
					// divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
			}
		})

 		userService.getUser(userid,(result) => {
			this.refs.userName.innerText += result.firstname;
			this.refs.userName.innerText += " " + result.lastname;
			this.refs.userAge.innerText += " " + result.age;
			this.refs.userPhone.innerText += " " + result.phone;
			this.refs.userEmail.innerText += " " + result.email;
			this.refs.userPoints.innerText += " " + result.points;
			this.refs.userZip.innerText += " " + result.zip;
			this.refs.userAddress.innerText += " " + result.address;
		});
		this.refs.btnDeactivate.onclick = () => {
			let r = confirm('Er du sikker på at du vil deaktivere brukeren din?');
			if(r == true){
				userService.deactivateUser(userid,(result) => {
					console.log('Deaktivert bruker - ID:' + userid);
					userService.emptystorage();
					history.push('/loginPage/')
					// history.push('/loginPage/');
					// this.forceUpdate();
				});
			}
		}
	}
}

class EditOtherProfile extends React.Component{
		constructor() {
			super();
			this.userisloggedin
		}
		render(){
				return(
						<div className="grid-container">
						<div>

		    <div className="profile-events">
		      <div className="profile-events-grid">
		    <div>
		      <h3 className="medium-title">Kommende vakter</h3>
		      <div className="profile-events-minor-grid">

						<div ref='upcoming'></div>

					</div>
		    </div>
		    <div>
		      <h3 className="medium-title">Deltatte vakter</h3>
		      <div className="profile-events-minor-grid">
		        <div>

						<div ref='earlierevents'></div>

		        </div>
		      </div>
		    </div>
		      </div>
		    </div>


					<div className="profile-course-registration">
						<h2 className="medium-title">Registrere kurs?</h2>
						<div>
							<p>Hvilken kvalifisering gjelder det:</p>
							<form ref='compForm'>
								<select ref='compSelect'>
								</select>
							</form>
							<button ref='btnAddComp'>Send inn</button>
							<div ref='compOutput'></div>
						</div>
					</div>
				</div>

		  <div>
		  <div>
		    <div className="profile-bg">
		      <h3 className="medium-title">Personalia</h3>
		      <img className="profile-picture" src="profilepicture.jpg" alt="" />
					<p className="profile-text" ref='medlemsnummer'>Brukerid:</p>
		      <p className="profile-text" ref='userName'></p>
		      <p className="profile-text" ref='userPoints'>Vaktpoeng:</p>
		      <p className="profile-text" ref='userAge'>Alder:</p>
		      <p className="profile-text" ref='userAddress'>Adresse:</p>
		      <p className="profile-text" ref='userZip'>Postnr:</p>
		      <p className="profile-text" ref='userPhone'>Telefon:</p>
		      <p className="profile-text" ref='userEmail'>Epost:</p>
					<p className="profile-text" ref='passive'></p>
					<button onClick = {() => {
						history.push('/editprofile/'),
						this.forceUpdate()}}>Rediger</button>
					<button ref="makeadmin">Gjør om til admin</button>
					<p className="profile-text" ref="utskrift"></p>
					<p className="profile-text" ref="passive"></p>
				</div>
		  </div>

		    <div>
		        <div className="profile-deactivate">
		          <h3 className="medium-title">Deaktivere profil?</h3>
		          <p>Deaktiver brukerens profil her:</p>
		          <button type="button" ref='btnDeactivate'>Ja, jeg ønsker å deaktivere denne profilen</button>
		        </div>
		    </div>
		  </div>
					</div>
				);
			}

		componentDidMount(){
			this.userisloggedin = userService.browseruser();
			userid = this.userisloggedin.userID;
			let str; let string; let array; let stri;
			let compid = 0;

			userService.getCompetences((result) => {
				for (let comp of result) {
					let compSel = document.createElement('OPTION');
					let compTitle = document.createTextNode(comp.title);

					compSel.appendChild(compTitle);
					this.refs.compSelect.appendChild(compSel);
				}
			})
			this.refs.btnAddComp.onclick = () => {
				let title = this.refs.compSelect.value;
				let finished = '2018-01-01';

	userService.getCompetence(title, (result) => {
		compid = result.compID;
		userService.regCompetence(viewid, compid, finished, (result) => {
			console.log(compid);
			this.forceUpdate();
			})
		})
	// Skriv en tekst her om at det er sendt til godkjenning
	}
	userService.getUserComp(viewid, (result) => {
		for (let usercomp of result) {
			this.refs.compOutput.innerText += usercomp.title + '\n';
		}
	})

					this.refs.makeadmin.onclick = () => {
						this.refs.makeadmin.disabled = true;
						this.refs.utskrift.innerText = 'Brukeren har nå admin egenskaper'
						userService.getUser(viewid, (result) => {
							let admin = 1;
							userService.makeAdmin(admin, viewid, (result) => {
							})
						})
					}
					userService.getThisUser2(viewid, (result) => {
						if(result.admin == 1) {
							this.refs.makeadmin.hidden = true;
							this.refs.utskrift.innerText = 'Brukeren er en Administrator'
						}
					userService.checkIfAdmin(admin, viewid, (result) => {
					})
				})

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

			userService.getEarlierUserEvents(viewid, (result) => {
      for (let event of result) {
        let divEvent = document.createElement('DIV');
        divEvent.className = 'aktueltarrangementer';

        let btnEvent = document.createElement('BUTTON');
        let btnEventTxt = document.createTextNode('Informasjon');
        let clickedEvent = event.eventID;

        btnEvent.appendChild(btnEventTxt);
        btnEvent.setAttribute('id', event.eventID);

        let titleEvent = document.createElement('span');
        // titleEvent.setAttribute('href', '/#');
        titleEvent.className = "blueTxt";
        titleEvent.innerText = event.name;

        btnEvent.onclick = () => {
          sendToEvent(clickedEvent);
        }

        divEvent.appendChild(titleEvent); //Fiks men lag en p for info

        let eventTxt = document.createElement('P');

				stri = event.date_start;
				if (stri) {
					string = stri.toString();
					array = string.split(" ");
					stri = array[2]+" "+array[1]+" "+array[3]+" "+array[4];
				}

        eventTxt.innerText += '\n' + 'Lokasjon: ' + event.area + '\n' + 'Kontakttelefon: ' + event.contact_phone + '\n' + 'Startdato: ' + stri;

        divEvent.appendChild(eventTxt);

        // divEvent.appendChild(btnEvent);
        this.refs.earlierevents.appendChild(divEvent);
        // divEvent.innerText += '\n'; Fjern dette når du legger til if-en
      }
    })

    userService.getUpcomingEvents(viewid, (result) => {
      for (let event of result) {
        let divEvent = document.createElement('DIV');
        divEvent.className = 'aktueltarrangementer';

        let btnEvent = document.createElement('BUTTON');
        let btnEventTxt = document.createTextNode('Informasjon');
        let clickedEvent = event.eventID;

        btnEvent.appendChild(btnEventTxt);
        btnEvent.setAttribute('id', event.eventID);

        let titleEvent = document.createElement('span');
        // titleEvent.setAttribute('href', '/#');
        titleEvent.className = "blueTxt";
        titleEvent.innerText = event.name;

        btnEvent.onclick = () => {
          sendToEvent(clickedEvent);
        }

        divEvent.appendChild(titleEvent); //Fiks men lag en p for info

        let eventTxt = document.createElement('P');

				str = event.date_start;
				if (str) {
					string = str.toString();
					array = string.split(" ");
					str = array[2]+" "+array[1]+" "+array[3]+" "+array[4];
				}
        eventTxt.innerText += '\n' + 'Lokasjon: ' + event.area + '\n' + 'Kontakttelefon: ' + event.contact_phone + '\n' + 'Startdato: ' + str;

        divEvent.appendChild(eventTxt);

        // divEvent.appendChild(btnEvent);
        this.refs.upcoming.appendChild(divEvent);
        // divEvent.innerText += '\n'; Fjern dette når du legger til if-en
      }
    })

		userService.getUser(viewid, (result) => {
			this.refs.medlemsnummer.innerText += result.userID;
			this.refs.userName.innerText += result.firstname;
			this.refs.userName.innerText += " " + result.lastname;
			this.refs.userAge.innerText += " " + result.age;
			this.refs.userPhone.innerText += " " + result.phone;
			this.refs.userEmail.innerText += " " + result.email;
			this.refs.userPoints.innerText += " " + result.points;
			this.refs.userZip.innerText += " " + result.zip;
			this.refs.userAddress.innerText += " " + result.address;
		});
			this.refs.btnDeactivate.onclick = () => {
				let r = confirm('Er du sikker på at du vil deaktivere denne brukeren?');
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
			<div className="big-container">
			<div className="edit-profile-bg">
				<h1 className="eventmediumtitle">Rediger profil</h1>
				<form>
          <div className="login-grid">
          <div className="form-group">
            <label className="login-text">Fornavn:</label>
            <input type="text" ref='editFirstName' className="form-control" />
            <label className="login-text">Adresse:</label>
            <input type="text" className="form-control" ref='editAddress' />
            <label className="login-text">By:</label>
            <input type="text" className="form-control" ref='editCity' />
            <label className="login-text">Epost:</label>
            <input type="email" className="form-control"  ref='editEmail' />
            <label className="login-text">Passord:</label>
            <input type="password" className="form-control" />
          </div>
          <div className="form-group">
            <label className="login-text">Etternavn:</label>
            <input type="text" className="form-control" ref='editLastName' />
            <label className="login-text">Telefon:</label>
            <input type="number" className="form-control" ref='editPhone' />
            <label className="login-text">Postnr:</label>
            <input type="number" className="form-control" ref='editZip' />
            <label className="login-text">Alder:</label>
            <input type="number" className="form-control" ref='editAge' />
            <label className="login-text">Bekreft passord:</label>
            <input type="password" className="form-control" ref='editPassword' />
          </div>
          </div>
        </form>
				<div className="login-grid">
				<div>
				<button type="button" className="btn btn-outline-danger" ref='btnSendEdit'>Lagre</button>
				</div>
				<div className="edit-profile-btn-right">
				<button type="button" className="btn btn-outline-danger" onClick = {() => {
					history.push('/profile/'),
					this.forceUpdate()}}>Tilbake</button>
					</div>
					</div>
					</div>
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
	constructor() {
		super();
		this.userisloggedin;
	}
  render() {
    return (<div>
      <div className="grid-container">
        <div className="main-wrap">
          <h1 className="title">Aktuelle saker</h1>

          <div className="news-left-grid">

            <div className="news-image-grid">
              <div>
                <img className="news-image" src="jemen.jpg" alt=""/>
              </div>
              <div>
                <img className="news-image" src="jemen.jpg" alt=""/>
              </div>
              <div>
                <img className="news-image" src="jemen.jpg" alt=""/>
              </div>
              <div>
                <img className="news-image" src="jemen.jpg" alt=""/>
              </div>
              <div>
                <img className="news-image" src="jemen.jpg" alt=""/>
              </div>
            </div>

            <div className="news-text-grid">
              <div className="news-text">
                <h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
                <p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
              </div>
              <div className="news-text">
                <h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
                <p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
              </div>
              <div className="news-text">
                <h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
                <p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
              </div>
              <div className="news-text">
                <h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
                <p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
              </div>
              <div className="news-text">
                <h5>Den humanitære katastrofen i Jemen løses ikke med nødhjelp</h5>
                <p>- Situasjonen i Jemen i dag er dramatisk. Nesten 80 prosent av befolkningen trenger nødhjelp for å klare seg. For hver dag som går uten en løsning på konflikten blir situasjonen verre. Folk dør av sykdommer som kan forhindres, mangel på mat, vann og strøm. Sykdommer som kolera kan forebygges, men i Jemen har det vært over en million tilfeller, fordi krigen har ført til kollaps i helsetilbudet, sier generalsekretær i Røde Kors i Norge Bernt G. Apeland.</p>
              </div>
            </div>

          </div>

        </div>

        <div>
          <div className="news-right-top" ref='usrDiv'>
            <img className="profile-picture" src="profilepicture.jpg" alt=""/>
            <p className="profile-text" ref='usrName'>Per Ole Finsnes</p>
            <p className="profile-text" ref='usrPoints'>Vaktpoeng: 14</p>
          </div>
          <div className="news-right-bottom">
            <h3 className="medium-title">Kommende arrangementer</h3>
            <div className="news-events" ref='upcoming'></div>

          </div>
        </div>
      </div>
    </div>);
  }
  componentDidMount() {
    this.refs.usrDiv.onclick = () => {
      history.push('/profile');
      this.forceUpdate();
    }
		this.userisloggedin = userService.browseruser();
		userid = this.userisloggedin.userID;
    userService.getUser(userid, (result) => {
      this.refs.usrName.innerText = result.firstname + ' ' + result.lastname;
      this.refs.usrPoints.innerText = 'Vaktpoeng: ' + result.points;
    })

    userService.getUpcomingevents((result) => {
      for (let event of result) {
        let divEvent = document.createElement('DIV');
        divEvent.className = 'aktueltarrangementer';

        let btnEvent = document.createElement('BUTTON');
        let btnEventTxt = document.createTextNode('Informasjon');
        let clickedEvent = event.eventID;

        btnEvent.appendChild(btnEventTxt);
        btnEvent.setAttribute('id', event.eventID);

        let titleEvent = document.createElement('span');
        // titleEvent.setAttribute('href', '/#');
        titleEvent.className = "blueTxt";
        titleEvent.innerText = event.name;

        btnEvent.onclick = () => {
          sendToEvent(clickedEvent);
        }

        divEvent.appendChild(titleEvent); //Fiks men lag en p for info

        let eventTxt = document.createElement('P');

        eventTxt.innerText += '\n' + 'Lokasjon: ' + event.area + '\n' + 'Kontakttelefon: ' + event.contact_phone + '\n' + 'Startdato: ' + event.date_start;

        divEvent.appendChild(eventTxt);

        // divEvent.appendChild(btnEvent);
        this.refs.upcoming.appendChild(divEvent);
        // divEvent.innerText += '\n'; Fjern dette når du legger til if-en
      }
    })
  }
}

class Events extends React.Component {
  render() {
    return (<div>

			<h1>Arrangementer</h1>
      <h4>Kommende arrangementer</h4>
      <button ref='showPreEvents'>Tidligere</button>
      <button ref='btnNewEvent'>Legg til arrangement</button>
      <br/><br/>

      <div className="event-container" ref='upcoming'>
			</div>
    </div>);
  }
  componentDidMount() {
    let btnPressed = false;
    // let thisDate = new Date();

    this.refs.btnNewEvent.onclick = () => {
      history.push('/newEvent/');
      this.forceUpdate();
    }

    this.refs.showPreEvents.onclick = () => {
      if (btnPressed == false) {
        this.refs.upcoming.innerText = '';
        userService.getUpcomingevents((result) => {
          for (let event of result) {
            let divEvent = document.createElement('DIV');
            divEvent.className = 'event-bg';

            let btnEvent = document.createElement('BUTTON');
            let btnEventTxt = document.createTextNode('Informasjon');
            let clickedEvent = event.eventID;

            btnEvent.appendChild(btnEventTxt);
            btnEvent.setAttribute('id', event.eventID);

            let titleEvent = document.createElement('H4');
            titleEvent.className = "eventmediumtitle";
            titleEvent.innerText = event.name;

            btnEvent.onclick = () => {
              sendToEvent(clickedEvent);
            }

            divEvent.appendChild(titleEvent); //Fiks men lag en p for info

            let eventTxt = document.createElement('P');

            eventTxt.innerText += '\n' + 'Lokasjon: ' + event.area + '\n' + 'Kontakttelefon: ' + event.contact_phone + '\n' + 'Startdato: ' + event.date_start;

            divEvent.appendChild(eventTxt);

            divEvent.appendChild(btnEvent);
            this.refs.upcoming.appendChild(divEvent);
            // divEvent.innerText += '\n'; Fjern dette når du legger til if-en
          }
          btnPressed = true;
          this.refs.showPreEvents.innerText = 'Tidligere';
        })
      } else {
        this.refs.upcoming.innerText = '';
        userService.getPastEvents((result) => {
          for (let event of result) {
            let divEvent = document.createElement('DIV');
            divEvent.className = 'event-bg';

            let btnEvent = document.createElement('BUTTON');
            let btnEventTxt = document.createTextNode('Informasjon');
            let clickedEvent = event.eventID;

            btnEvent.appendChild(btnEventTxt);
            btnEvent.setAttribute('id', event.eventID);

            let titleEvent = document.createElement('h4');
            titleEvent.className = 'eventmediumtitle';
            titleEvent.innerText = event.name;

            divEvent.appendChild(titleEvent);

            btnEvent.onclick = () => {
              sendToEvent(clickedEvent);
            }

            let eventTxt = document.createElement('P');

            eventTxt.innerText += '\n' + 'Lokasjon: ' + event.area + '\n' + 'Kontakttelefon: ' + event.contact_phone + '\n' + 'Startdato: ' + event.date_start;

            divEvent.appendChild(eventTxt);

            divEvent.appendChild(btnEvent);
            this.refs.upcoming.appendChild(divEvent);
            // divEvent.innerText += '\n'; Fjern dette når du legger til if-en
          }
          btnPressed = false;
          this.refs.showPreEvents.innerText = 'Kommende';
        })
      }
    }

    this.refs.showPreEvents.click();

    function sendToEvent(id) {
      eventID = id;
      history.push('/divEvent/');

    }
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
			history.push('/newEvent/');
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
			avslattebrukere: '',
		}
		this.brukere = '';
		this.liste = '';
		this.avslatt = '';
		}

	render() {
	return (
		<div>
		<h2>Adminsiden</h2>
		<h3> Ikke Godkjente brukere </h3>
		<ul>
		{this.state.brukergodkjenning ? this.state.brukergodkjenning:'Alle brukere er aktivert'}
		</ul>
		<h5> Avslåtte brukere </h5>
		<ul>
		{this.state.avslattebrukere ? this.state.avslattebrukere: 'Ingen brukere er avslått'}
		</ul>
		<h3> roller </h3>
		<ul>
		{this.state.mannskapsliste}
		</ul>
		<button ref="newrole">Lag ny rolle</button>
		</div>
		)
	}

	updateDenyUser(userid) {
		let inactive = 2;
		userService.changeUser(inactive, userid, (result) => {
		userService.getInactiveUsers(userid, (result) => {
				this.brukere = result;
				this.skrivutinfo();
				userService.getDeniedUsers(userid, (result) => {
					this.avslatt = result;
					this.skrivutavslatt();
				})
			})
		})
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

	updateavslatt(userid) {
	let	inactive = 0;
		userService.changeUser(inactive, userid, (result) => {
		userService.getDeniedUsers(userid, (result) => {
				this.avslatt = result;
				this.skrivutavslatt();
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

	skrivutavslatt() {
		let utskriftavslatt = []
		for (let user of this.avslatt) {
			utskriftavslatt.push(
				<li key = {user.userID}>
				{user.firstname + " " + user.lastname}
				<button onClick = {() => {
					this.updateavslatt(user.userID)
				}}>Angre</button>
					</li>
				)
		}
		this.setState ({avslattebrukere: utskriftavslatt})
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
				<button onClick = {() => {
					this.updateDenyUser(user.userID)
				}}>Avslå</button>
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
		userService.getDeniedUsers(userid, (result) => {
			this.avslatt = result;
			this.skrivutavslatt();
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
						<div className="big-container">
						<div className="new-event-bg">
							<h1 className="eventmediumtitle">Legg til arrangement</h1>
							<form>
			          <div className="login-grid">
			          <div className="form-group">
			            <label className="login-text">Tittel:</label>
			            <input type="text" className="form-control" ref='regArrName' />
			            <label className="login-text">Startdato:</label>
			            <input type="datetime-local" className="form-control" ref='regStartDato' />
			            <label className="login-text">Vaktansvarlig:</label>
			            <input type="text" className="form-control" ref='regshiftManager'/>
			            <label className="login-text">Vaktlag:</label>
									<select className="form-control" id="exampleFormControlSelect1" ref='rolelistSelect'>
							    </select>
			          </div>
			          <div className="form-group">
			            <label className="login-text">Vaktpoeng:</label>
			            <input type="number" className="form-control" ref='regPoints' />
			            <label className="login-text">Sluttdato:</label>
			            <input type="datetime-local" className="form-control" ref='regSluttDato' />
			            <label className="login-text">Kontakttelefon:</label>
			            <input type="number" className="form-control" ref='regTlf' />
			            <label className="login-text">Møtested:</label>
			            <input type="text" className="form-control" ref='regMeet' />
			          </div>
			          </div>
								<div className="form-group">
  								<label>Beskrivelse:</label>
  								<textarea className="form-control" rows="5" ref='regDescript'></textarea>
								</div>
			        </form>
							<div className="login-grid">
							<div>
							<button ref='btnSendArr' className="btn btn-outline-danger">Legg til</button>
							</div>
							<div className="edit-profile-btn-right">
							<button ref='btnBackArr' className="btn btn-outline-danger">Tilbake</button>
							</div>
							</div>
							</div>
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
						let shiftManager = this.refs.regshiftManager.value;

						let rolelistName = this.refs.rolelistSelect.value;

						userService.getRolelist(rolelistName,(result) => {
							rolelistid = result.rolelistID;

							userService.addEvent(name, date_start, date_end, contact_phone, rolelistid, description, area, point_award, shiftManager, (result) => {
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
				<Route exact path='/newEvent' component={NewEvent}/>
				<Route exact path='/homepage' component={Homepage}/>
				<Route excat path='/loginPage' component={LoginPage}/>
				<Route excat path='/register' component={Register}/>
				<Route excat path='/calendar' component={Calendar}/>
				<Route exact path='/profile' component={Profile}/>
				<Route excat path='/editprofile' component={EditProfile}/>
				<Route excat path='/events' component={Events}/>
				<Route excat path='/contact' component={Contact}/>
				<Route excat path='/search' component={Search}/>
				<Route excat path='/competence' component={Competence}/>
				<Redirect from="/" to="/loginPage" />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));
//Neste: Vise (og skjule) og oppdatere brukerinfo
//Må kunne endre passord
//Ikke bruk force.update
