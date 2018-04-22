class divEvent extends React.Component {
	constructor() {
		super();
		this.userisloggedin;
	}
	render() {
		return(
			<div className="big-container">
			<div className="about-bg">
			<h1 className="title" ref='eventName'></h1>
			<div className="event-div-grid">
				<div className="event-div-p">
					<p>Startdato:</p>
					<p>Sluttdato:</p>
					<p>Møtested:</p>
					<p>Vaktansvarlig:</p>
					<p>Kontaktinfo:</p>
					<p>Rolleliste:</p>
				</div>
				<div className="event-div-ref">
					<p ref='eventstartdate'></p>
					<p ref='eventsluttdate'></p>
					<p ref='eventmøtested'></p>
					<p ref='shiftManager'></p>
					<p ref='kontaktinfo'></p>
					<p ref='rolelist'></p>
				</div>
			</div>
			<div className="event-div-descrip">
				<p className="event-div-descrip-p">Beskrivelse:</p> <br />
			</div>

			Beskrivelse: <br /> <span ref='eventinfo'></span><br /> <br />
		<button>Tilbake</button>
			<button ref='editArr'>Rediger</button>
			<button ref='Interested'>Meld interesse</button>
			<button ref='notInterested'>Avmeld interesse</button>
			<button ref='checkinterested'>Se interesserte</button><br />
			<span ref="hasevent"></span>
			</div>
			</div>
		)
	}

	componentDidMount() {
		this.userisloggedin = userService.browseruser();
		userid = this.userisloggedin.userID;
		this.refs.notInterested.hidden = true;
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
					this.refs.shiftManager.innerText = result.shiftManager;

					let rolelistid = result.rolelist_roleID;

    userService.getRolelistName(rolelistid, (result) => {
         this.refs.rolelist.innerText = result.name;
      })

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
					userService.checkifUserHasEvent(eventID, userid, (result) => {
						if (result != undefined) {
							this.refs.Interested.hidden = true;
							this.refs.notInterested.hidden = true;
							this.refs.hasevent.innerText = "Du er meldt på dette arrangementet, kontakt en administrator for å melde deg av";
						}
					})

					this.refs.Interested.onclick = () => {
					userService.addInterested(eventID, userid, (result) => {
						this.refs.hasevent.innerText = 'Du har meldt deg interresert';
						this.refs.Interested.hidden = true;
						this.refs.notInterested.hidden = false;
						this.forceUpdate();
					})
			}

			userService.checkifInterested(eventID, userid, (result) => {
				if (result != undefined) {
					this.refs.Interested.hidden = true;
					this.refs.notInterested.hidden = false;
					this.refs.hasevent.innerText = 'Du er meldt interresert på arrangementet';
					this.forceUpdate();
				}
			})

				this.refs.notInterested.onclick = () => {
				userService.deleteInterested(eventID, userid, (result) => {
					this.refs.notInterested.hidden = true;
					this.refs.Interested.hidden = false;
					this.refs.hasevent.innerText = 'Du er ikke lenger interresert';
				})
			}
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
