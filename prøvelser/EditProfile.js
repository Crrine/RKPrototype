import React from 'react';


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
				<button ref='btnErase'>Fjern endringer</button>
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
		 	let firstname = this.refs.editFirstName.value;
			let lastname = this.refs.editLastName.value;
			let address = this.refs.editAddress.value;
			let email = this.refs.editEmail.value;
			let password = this.refs.editPassword.value;
			let city = this.refs.editCity.value;
			let zip = this.refs.editZip.value;
			let phone = this.refs.editPhone.value;
			let age = this.refs.editAge.value;

			userService.editUser(userid,firstname, lastname, address, email, password, city, zip, phone, age, (result) => {
			})
		}
	}
}

export default EditProfile
