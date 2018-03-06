import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'carinelj',
    password: 'jfcfn3zg',
    database: 'carinelj'
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
    connection.query('SELECT * FROM Users', (error, result) => {
      if(error) throw error;

      callback(result);
    });
  }
  getUser(id, callback){
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  addUser(FirstName, City, callback) {
    connection.query('INSERT INTO Users (FirstName, City) values (?, ?)', [FirstName, City], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  deleteUser(id){
    connection.query('DELETE * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  loginUser(username, password, callback){
    connection.query('SELECT id FROM Users WHERE UserName = ? AND PASSWORD =?', [username, password], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
}
let userService = new UserService();

export {userService};
