import React from 'react';


let userid = 0;

class Profile extends React.Component{
	render(){
		return(
			<div>
				<h1>Din profil</h1>
				<span ref='userName'></span><br />
				<span ref='userEmail'></span><br />
				<button ref='btnShowInfo'>Vis info</button><br />
				<div ref='showInfo'>
					<span ref='userAddress'></span><br />
					<span ref='userCity'></span><br />
					<span ref='userZip'></span><br />
					<span ref='userPhone'></span><br />
					<span ref='userAge'></span><br />
					<span ref='userPassword'></span><br />
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
					" Adresse: " + result.address +
					" By: " + result.city +
					" Postnummer: " + result.zip +
					" Tlf: " + result.phone +
					" Alder: " + result.age +
					" Passord: " + result.password;
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
export default Profile;
