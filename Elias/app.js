import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import globalize from 'globalize';
import { NavLink } from 'react-router-dom';

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

					<div className="container">
        <div className="login-wrap">

        <div>
          <img id="login-logo" src="rodekors-01.png" alt="Logo" />
        <form>
          <div className="form-group">
            <label htmlFor="usr">Epost:</label>
            <input type="text" className="form-control" id="usr" />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Passord:</label>
            <input type="password" className="form-control" id="pwd" />
          </div>
        </form>
        <div className="login-grid">
          <div>
            <a href="glemt.html">Glemt passord?</a> <br />
            <a href="#">Registrer ny bruker?</a>
          </div>
          <div>
            <button id="login-button" type="button" className="btn btn-danger">Logg inn</button>
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

				userService.loginUser(inpUser, inpPassword, (result) => {
					if(result != undefined){
						console.log("logget inn bruker - ID:" + result.userID);
						userid = result.userID;
						loggedIn = true;
						history.push('/homepage/');
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

						<link rel="stylesheet" type="text/css" href="nav.css" />
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
									<li className="nav-item">
										<NavLink exact to='/events' className="nav-link">Arrangementer<span className="sr-only">(current)</span></NavLink>
									</li>
									<li className="nav-item">
										<NavLink exact to='/contact' className="nav-link" href="#">Om oss</NavLink>
									</li>
									<li className="nav-item dropdown">
										<NavLink exact to='/profile' className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											Profil
										</NavLink>
										<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
											<a className="dropdown-item" href="index.html">Logg ut</a>
										</div>
									</li>
									<li className="nav-item">
										<NavLink exact to='/search' className="nav-link" href="#">Brukersøk</NavLink>
									</li>
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
				</div>
			)
		}
	}
	componentDidMount(){
		if(!loggedIn){
			history.push('/loginPage');
			this.forceUpdate();
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




				<div className="grid-container">
<div>

    <div className="profile-events">
      <div className="profile-events-grid">
    <div>
      <h3 className="medium-title">Kommende vakter</h3>
      <div className="profile-events-minor-grid">
        <div>
          <h6>Trønderfest</h6>
          <p className="profile-event-timenplace">Dato: 16/04/17 Tid: 15:00 - 19:00</p>
          <p className="profile-event-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div>
          <h6>Trønderfest</h6>
          <p className="profile-event-timenplace">Dato: 16/04/17 Tid: 15:00 - 19:00</p>
          <p className="profile-event-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div>
          <h6>Trønderfest</h6>
          <p className="profile-event-timenplace">Dato: 16/04/17 Tid: 15:00 - 19:00</p>
          <p className="profile-event-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
    <div>
      <h3 className="medium-title">Deltatte vakter</h3>
      <div className="profile-events-minor-grid">
        <div>
          <h6>Trønderfest</h6>
          <p className="profile-event-timenplace">Dato: 16/04/17 Tid: 15:00 - 19:00</p>
          <p className="profile-event-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div>
          <h6>Trønderfest</h6>
          <p className="profile-event-timenplace">Dato: 16/04/17 Tid: 15:00 - 19:00</p>
          <p className="profile-event-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div>
          <h6>Trønderfest</h6>
          <p className="profile-event-timenplace">Dato: 16/04/17 Tid: 15:00 - 19:00</p>
          <p className="profile-event-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
      </div>
    </div>

    <div className="profile-course-registration">
      <h2 className="medium-title">Registrere kurs?</h2>
      <p>Hvilken kvalifisering gjelder det:</p>
      <input type="text" />
      <p>Dokumentasjon på kvalifikasjon:</p>
      <input type="file" />
      <br /> <button type="button">Send inn</button>
    </div>

</div>



  <div>
  <div>
    <div className="profile-bg">
      <h3 className="medium-title">Personalia</h3>
      <img className="profile-picture" src="profilepicture.jpg" alt="" />
      <p className="profile-text">Per Ole Finsnes</p>
      <p className="profile-text">Vaktpoeng: 14</p>
      <p className="profile-text">Fødselsdato:</p>
      <p className="profile-text">Adresse:</p>
      <p className="profile-text">Postnr:</p>
      <p className="profile-text">Telefon:</p>
      <p className="profile-text">Epost:</p>
    </div>
  </div>

    <div>
        <div className="profile-deactivate">
          <h3 className="medium-title">Deaktivere profil?</h3>
          <p>Ønsker du av en grunn å deaktivere din profil kan du klikke på knappen under. Profilen din vil da bli deaktivert og du må kontakte administrator for å aktivere den igjen.</p>
          <button type="button">Ja, jeg ønsker å deaktivere min profil</button>
        </div>
    </div>
  </div>
 </div>


			</div>
		);
	}
	componentDidMount(){
		userService.getUpcomingEvents(userid,(result) => {
			for(let event of result){
				this.refs.upcomingEvents.innerText += event.name + '\n';
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
				userService.regCompetence(userid, compid, finished, (result) => {
					console.log(compid);
				})
			})
			this.forceUpdate(); // Skriv en tekst her om at det er sendt til godkjenning
		}
		userService.getUserComp(userid, (result) => {
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
					<div className="news-right-top" ref='usrDiv'>
							<img className="profile-picture" src="profilepicture.jpg" alt="" />
							<p className="profile-text" ref='usrName'>Per Ole Finsnes</p>
							<p className="profile-text" ref='usrPoints'>Vaktpoeng: 14</p>
						</div>
						<div className="news-right-bottom">
							<h3 className="medium-title">Kommende arrangementer</h3>
							<div className="news-events" ref='upcoming'>

							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
	componentDidMount(){
			this.refs.usrDiv.onclick = () => {
				history.push('/profile');
				this.forceUpdate();
			}

			userService.getUser(userid, (result) => {
				this.refs.usrName.innerText = result.firstname + ' ' + result.lastname;
				this.refs.usrPoints.innerText = 'Vaktpoeng: ' + result.points;
			})


			userService.getUpcomingevents((result) => {
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

						eventTxt.innerText += '\n' +
							'Lokasjon: ' + event.area + '\n' +
							'Kontakttelefon: ' + event.contact_phone + '\n' +
							'Startdato: ' + event.date_start;

						divEvent.appendChild(eventTxt);

						// divEvent.appendChild(btnEvent);
						this.refs.upcoming.appendChild(divEvent);
						// divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
				}
			})
		}
}


// class Events extends React.Component {
// 	render(){
// 		return(
// 			<div>
// 			<div className="event-container">
//
// 					<div className="event-bg">
// 						<h4 className="aboutmediumtitle">Trønderfest</h4>
// 						<p className="event-timenplace">Dato: 16/04/17 Tid: 15:00 - 19:00</p>
// 						<p className=""></p>
//
// 			<button id="myBtn">Open Modal</button>
//
// 			<div id="myModal" className="modal">
//
// 				<div className="modal-content">
// 					<span className="close">&times;</span>
// 					<p>Some text in the Modal..</p>
// 				</div>
//
// 			</div>
// 					</div>
// 					<div className="event-bg">
// 					<div ref='upcoming'></div>
// 					</div>
// 					<div className="event-bg">
//
// 					</div>
// 					<div className="event-bg">
//
// 					</div>
// 					<div className="event-bg">
//
// 					</div>
// 					<div className="event-bg">
//
// 					</div>
// 					<div className="event-bg">
//
// 					</div>
// 					<div className="event-bg">
//
// 					</div>
// 					<div className="event-bg">
//
// 					</div>
// 					</div>
// 			</div>
// 		);
// 	}
// 	componentDidMount(){
// 		userService.getUpcomingevents((result) => {
// 			for(let event of result){
// 				let divEvent = document.createElement('DIV');
//
// 				divEvent.innerText = event.name + '\n' +
// 					'Lokasjon: ' + event.area + '\n' +
// 					'Kontakttelefon: ' + event.contact_phone + '\n';
//
// 				this.refs.upcoming.appendChild(divEvent);
// 				divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
// 			}
// 		})
// 	}
// }
//
// class EarlierEvents extends React.Component {
// 		render(){
// 			return(
// 				<div>
// 					<h1>Arrangementer</h1>
// 					<h4>Tidligere arrangementer</h4>
// 					<div ref='earlier'></div>
// 				</div>
// 			);
// 		}
// 		componentDidMount(){
// 			userService.getEarlierEvents((result) => {
// 				for(let event of result){
// 					let divEvent = document.createElement('DIV');
//
// 					divEvent.innerText = event.name + '\n' +
// 						'Lokasjon: ' + event.area + '\n' +
// 						'Kontakttelefon: ' + event.contact_phone + '\n';
//
// 					this.refs.earlier.appendChild(divEvent);
// 					divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
// 				}
// 			})
// 		}
// }

class Events extends React.Component{
	render(){
		return(
			<div>
				<h1>Arrangementer</h1>
				<h4>Kommende arrangementer</h4>
				<button ref='showPreEvents'>Tidligere</button>
				<button ref='btnNewEvent'>Legg til arrangement</button>
				<br /><br />

				<div className="event-container" ref='upcoming'></div>
			</div>
		);
		}
		componentDidMount(){
		let btnPressed = false;
		// let thisDate = new Date();

		this.refs.btnNewEvent.onclick = () => {
			history.push('/newEvent/');
			this.forceUpdate();
		}

		this.refs.showPreEvents.onclick = () => {
			if(btnPressed == false){
				this.refs.upcoming.innerText = '';
				userService.getUpcomingevents((result) => {
						for(let event of result){
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

							eventTxt.innerText += '\n' +
								'Lokasjon: ' + event.area + '\n' +
								'Kontakttelefon: ' + event.contact_phone + '\n' +
								'Startdato: ' + event.date_start;

							divEvent.appendChild(eventTxt);

							divEvent.appendChild(btnEvent);
							this.refs.upcoming.appendChild(divEvent);
							// divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
					}
					btnPressed = true;
					this.refs.showPreEvents.innerText = 'Tidligere';
				})
			}else{
				this.refs.upcoming.innerText = '';
				userService.getPastEvents((result) => {
						for(let event of result){
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

							eventTxt.innerText += '\n' +
								'Lokasjon: ' + event.area + '\n' +
								'Kontakttelefon: ' + event.contact_phone + '\n' +
								'Startdato: ' + event.date_start;

							divEvent.appendChild(eventTxt);

							divEvent.appendChild(btnEvent);
							this.refs.upcoming.appendChild(divEvent);
							// divEvent.innerText += '\n'; //Fjern dette når du legger til if-en
					}
					btnPressed = false;
					this.refs.showPreEvents.innerText = 'Kommende';
				})
			}
		}

		this.refs.showPreEvents.click();

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

					let rolelistid = result.rolelist_roleID;

					userService.getRolelistName(rolelistid, (result) => {
						this.refs.rolelist.innerText = result.name;
					})
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
			history.push('/newEvent/');
			this.forceUpdate();
		}
	}
	componentWillMount() {
			userService.getEvent((result) => {
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
				<Route excat path='/editEvent' component={EditEvent}/>
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


// <h1>Navigasjonsbaren</h1>
// <nav>
// 	<Link to='/profile'>Din profil</Link><br />
// 	<Link to='/homepage'>Aktuelle saker</Link><br />
// 	<Link to='/events'>Arrangementer</Link><br />
// 	<Link to='/calendar'>Kalender</Link><br />
// 	<Link to='/contact'>Kontakt oss</Link><br />
// 	<Link to='/search'>Brukersøk</Link><br />
// 	<button ref='logout' onClick = {() => {
// 		loggedIn = false, history.push('/loginPage/'), console.log('logget ut bruker'),
// 		this.forceUpdate()}}>Logg ut</button><br />
// </nav>
