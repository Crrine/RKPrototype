import React from 'react';


let loggedIn = false;
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

export default Navbar
