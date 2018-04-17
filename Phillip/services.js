import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_oops_1',
    password: 'tCFgEwfm',
    database: 'g_oops_1'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

class UserService {
  getUsers(callback){
    connection.query('SELECT * FROM user', (error, result) => {
      if(error) throw error;

      callback(result);
    });
  }
  getUser(id, callback){
    connection.query('SELECT * FROM user WHERE userID=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  addInterested(eventID, userID, callback) {
    connection.query('INSERT INTO Interested (eventID, userID) values (?, ?)', [eventID, userID], (error, result) => {
      if (error) throw error;

      callback();
    })
  }
  checkifInterested(eventID, userID, callback) {
    connection.query('Select * from Interested WHERE eventID = ? AND userID = ?', [eventID, userID], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    })
  }
  getInterested(eventID, userID, callback){
    connection.query('SELECT * FROM Interested INNER JOIN user ON (Interested.userID = user.userID) WHERE eventID=?', [eventID], (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

getUserHasEvent(userID, eventID, callback) {
  connection.query('SELECT * FROM user_has_event INNER JOIN user ON (user_has_event.userID = user.userID) WHERE eventID=?', [eventID], (error, result) => {
    if (error) throw error;

    callback(result);
  })
}
addUserHasEvent(userID, eventID, callback) {
  connection.query('INSERT INTO user_has_event (userID, eventID) values (?, ?)', [userID, eventID], (error, result) => {
    if (error) throw error;

    callback();
  })
}

  deleteInterested(eventID, userID, callback) {
    connection.query('DELETE FROM Interested WHERE eventID = ? AND userID = ?', [eventID, userID], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  addUser(firstname, lastname, address, email, password, city, zip, phone, age, callback) {
    connection.query('INSERT INTO user (firstname, lastname, address, email, password, city, zip, phone, age) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstname, lastname, address, email, password, city, zip, phone, age], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  editUser(userid,newFirstname, newLastname, newAddress, newEmail, newPassword, newCity, newZip, newPhone, newAge, callback) {
    connection.query('UPDATE user SET firstname=?, lastname=?, address=?, email=?, password=?, city=?, zip=?, phone=?, age=? WHERE userID=?', [newFirstname, newLastname, newAddress, newEmail, newPassword, newCity, newZip, newPhone, newAge, userid], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  editArr(eventID, newName, newStartDato, newEndDato, newTlf, newrolelist, newMeet, newDesc, callback) {
    connection.query('UPDATE event SET name=?, date_start=?, date_end=?, contact_phone=?, rolelist_roleID=?, area=?, description=? WHERE eventID=?', [newName, newStartDato, newEndDato, newTlf, newrolelist, newMeet, newDesc, eventID], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  deleteUser(id){
    connection.query('DELETE * FROM user WHERE userID=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  loginUser(email, password, callback){
    connection.query('SELECT userID FROM user WHERE email = ? AND password =? AND inactive=0', [email, password], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  addEvent(name, date_start, date_end, contact_phone, rolelist_roleID, description, area, callback) {
    connection.query('INSERT INTO event (name, date_start, date_end, contact_phone, rolelist_roleID, description, area) values (?, ?, ?, ?, ?, ?, ?)', [name, date_start, date_end, contact_phone, rolelist_roleID, description, area], (error, resutlt) => {
      if (error) throw error;

      callback();
    });
  }
  getDivEvent(eventID, callback){
    connection.query('SELECT * FROM event WHERE eventID=?', [eventID], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  getEvents(callback){
    connection.query('SELECT * FROM event ORDER BY date_start',(error,result)=> {
      if(error) throw error;
      callback(result);
    })
  }

  getEvent(callback){
    connection.query('SELECT eventID, name AS title, date_start AS startDate, date_end AS endDate FROM event',(error,result)=> {
      if(error) throw error;
      callback(result);
    })
  }

  getUpcomingEvents(userid,callback){
    connection.query('SELECT * FROM event INNER JOIN user_has_event ON event.eventID = user_has_event.event_eventID WHERE user_userID =? ORDER BY event.date_start', [userid], (error, result) => {
      if (error) throw error;

      callback(result);
    })
  }

  deactivateUser(userid, callback){
    connection.query('UPDATE user SET inactive=1 where userID=?', [userid], (error,result) => {
      if(error) throw error;
      callback(result);
    })
  }

  activateUser(userid, callback){
    connection.query('UPDATE user SET inactive=0 where userID=?', [userid], (error,result) => {
      if(error) throw error;
      callback(result);
    })
  }

  getCompetences(callback){
  connection.query('SELECT * FROM competence ORDER BY title', (error,result) => {
    if(error) throw error;

    callback(result);
  });
}

getCompetence(title, callback){
  connection.query('SELECT * FROM competence WHERE title=?', [title], (error,result) => {
    if(error) throw error;

    callback(result[0]);
  });
}
regCompetence(userid, compid, finished, callback){
  connection.query('INSERT into user_has_competence (user_userID, competence_compID, finished) values (?,?,?)', [userid, compid, finished], (error, result) => {
    if(error) throw error;

    callback();
  })
}
  search(keyword, callback){
    connection.query("SELECT * FROM user WHERE firstname LIKE ? OR lastname LIKE ? ORDER BY firstname", [keyword + '%', keyword + '%'], (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }
}
let userService = new UserService();

export {userService};
