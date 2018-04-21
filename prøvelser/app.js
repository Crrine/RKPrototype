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
						this.forceUpdate()}}>Kompetanse</button>
						<button ref="makeadmin">Gjør om til admin</button><br />
						<span ref="utskrift"></span><br />
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
