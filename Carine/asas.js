class ChangeRole extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (<div className="big-container">
			<div className="main-wrap">
      <h1 className="title">Rediger vaktmal</h1>
				<div className="admin-grid">
					<div>
			      <h3 className="medium-title" ref='roleName'></h3>
			      <label>
			        Navn på vaktmalen:<br/>
			        <input ref='editRoleName' type='text'/><br/>
			      </label>
			      <label>
			        Beskrivelse:<br/>
			        <input ref='editDescription' type='text'/><br/>
			      </label>
			      <label>Legg til rolle:<br/>
			        <select ref='roleSelect'></select>
			        <button ref='addRoleToList'>Legg til</button>
			      </label>
					</div>

					<div>
						<h3 className="medium-title">Rolleliste:</h3>
			      <div ref='savedRoles'>
			      </div>
					</div>
					<div>
						<button className="btn btn-outline-danger" ref="back">Tilbake</button>
					</div>
					<div className="admin-btn-right">
						<button className="btn btn-success" ref="EditRole">Lagre</button>
						<button className="btn btn-danger" ref='deleteRoleList'>Slett vaktmal</button>
					</div>
				</div>
		</div>
    </div>)
  }
  update() {
		this.refs.deleteRoleList.onclick = () => {
			userService.deleteRoleList(rolelistID, (result) => {
				console.log('Slettet vaktmal, ID - ' + rolelistID);
				history.push('/admin');
			})
		}

    userService.getThisRoleList(rolelistID, (result) => {
      this.refs.editRoleName.value = result.name;
      this.refs.editDescription.value = result.description;
      this.refs.roleName.innerText = result.name;
    })
    this.refs.EditRole.onclick = () => {
      var editname = this.refs.editRoleName.value;
      var editDescription = this.refs.editDescription.value;

      userService.editRoleList(rolelistID, editname, editDescription, (result) => {})
      console.log('Vaktmal ble oppdatert, ID: ' + rolelistID);
      history.push('/admin/');
    }
    this.refs.back.onclick = () => {
      history.push('/admin/')
    }
    userService.getRoles((result) => {
      for (let role of result) {
        let roleSel = document.createElement('OPTION');
        let roleTitle = document.createTextNode(role.title);

        roleSel.appendChild(roleTitle);
        this.refs.roleSelect.appendChild(roleSel);
      }
    })
    userService.getRolesFromList(rolelistID, (result) => {
      for (let listrole of result) {
        let roleitem = document.createElement('LI');
        let roleitemTitle = document.createTextNode(listrole.title);

				let btnDeleteRole = document.createElement('BUTTON');
				let btnDeleteRoleTxt = document.createTextNode('Slett');
				btnDeleteRole.appendChild(btnDeleteRoleTxt);
				btnDeleteRole.setAttribute('id',listrole.roleID);
				btnDeleteRole.className = "btn btn-outline-danger btn-sm"

        roleitem.appendChild(roleitemTitle);
				roleitem.appendChild(btnDeleteRole);
        this.refs.savedRoles.appendChild(roleitem);
				let roleID = btnDeleteRole.id;

				btnDeleteRole.onclick = () => {
					userService.deleteRoleFromList(rolelistID, roleID, (result) => {
						console.log('Fjernet rolle ID - ' + btnDeleteRole.id);
						this.refs.roleSelect.innerText = '';
						this.update();
					});
				}
      }
    })
    this.refs.addRoleToList.onclick = () => {
      let roletitle = this.refs.roleSelect.value;
      userService.getRole(roletitle, (result) => {
        let roleID = result.roleID;

        userService.addRoleToList(roleID, rolelistID, (result) => {
					console.log('La til rolle ID - ' + roleID);
					this.refs.savedRoles.innerText = 'Rolleliste:';
					this.refs.roleSelect.innerText = '';
          this.update();

        });
      })
    }
  }
  componentDidMount() {
    this.update();
  }
}
