class divEvent extends React.Component {
	constructor() {
		super();
		this.userisloggedin;
	}
	render() {
		return (<div>
			<h1>Valgt arrangement:
			</h1>
			<br/>
			arrangementets navn:
			<span ref='eventName'></span><br/>
			Startdato:
			<span ref='eventstartdate'></span><br/>
			Sluttdato:
			<span ref='eventsluttdate'></span><br/>
			Møtested:
			<span ref='eventmøtested'></span><br/>
			Kontaktinfo:
			<span ref='kontaktinfo'></span><br/>
			rolleliste:
			<span ref='rolelist'></span><br/>
			Beskrivelse:
			<br/>
			<span ref='eventinfo'></span><br/>
			<br/>
			<button ref='editArr'>Rediger</button>
			<button ref='Interested'>Meld interesse</button>
			<button ref='notInterested'>Avmeld interesse</button>
			<button ref='checkinterested'>Sjekkinterreserte medlemmer</button><br/>
			<span ref="hasevent"></span>
		</div>)
	}

	componentDidMount() {
		this.userisloggedin = userService.browseruser();
		userid = this.userisloggedin.userID;
		this.refs.notInterested.hidden = true;
		if (this.userisloggedin.admin !== 1) {
			this.refs.checkinterested.hidden = true;
			this.refs.editArr.hidden = true;
		}
		let str;
		let string;
		let array;

		userService.getDivEvent(eventID, (result) => {
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

      str = result.date_start;
      if (str) {
        string = str.toString();
        array = string.split(" ");
        this.refs.eventstartdate.innerText = array[2] + " " + array[1] + " " + array[3] + " " + array[4];
      }
      str = result.date_end;
      if (str) {
        string = str.toString();
        array = string.split(" ");
        this.refs.eventsluttdate.innerText = array[2] + " " + array[1] + " " + array[3] + " " + array[4];
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

class Vaktliste extends React.Component {
  constructor() {
    super();
    this.state = {
      users: '',
      userhasevent: ''
    }
    this.update = "";
    this.hasevent = "";
  }
  render() {
    return (<div>
      <h1>
        Påmeldte medlemmer
      </h1>
      <ul>
        {
          this.state.userhasevent
            ? this.state.userhasevent
            : 'Ingen påmeldte'
        }
      </ul>
      <h1>
        Interreserte medlemmer
      </h1>
      <ul>
        {
          this.state.users
            ? this.state.users
            : 'Ingen Interreserte'
        }
      </ul>
      <button ref="backButton">Tilbake</button>
    </div>)
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
    userService.deleteFromArr(eventID, userid, (result) => {
      userService.getUserHasEvent(userid, eventID, (result) => {
        this.hasevent = result;
        this.hentbrukere();
      })
    })
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
      pameldte.push(<li key={user.userID}>
        <Link onClick={() => {
            viewid = user.userID;
          }} to={'/editotherprofile/'}>
          {user.firstname + " " + user.lastname}
        </Link>
        <button onClick={() => {
            this.deletefromvakt(user.userID)
          }}>Meld av</button>
      </li>)
    }

    this.setState({userhasevent: pameldte})
  }

  jodajoda() {
    var int = [];

    for (let user of this.update) {
      int.push(<li key={user.userID}>
        {user.firstname}
        <button onClick={() => {
            this.addUser(user.userID)
            this.deleteuser(user.userID)
          }}>aksepter</button>
        <button onClick= {() => {
				this.deleteuser(user.userID)
					}}>deny</button>
      </li>)
    }
    this.setState({users: int})
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
    this.refs.backButton.onclick = () => {
      history.push('/divEvent');
    }
  }
}
