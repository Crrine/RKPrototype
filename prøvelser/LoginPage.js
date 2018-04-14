import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { userService } from './services';
import {createHashHistory} from 'history';
import Register from './Register';
import Navbar from './Navbar';
export const history = createHashHistory();

let loggedIn = false;
let userid = 0;
let regPress = false;

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

export default LoginPage;
