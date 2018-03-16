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
    connection.query('SELECT * FROM users', (error, result) => {
      if(error) throw error;

      callback(result);
    });
  }
  getUser(id, callback){
    connection.query('SELECT * FROM users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  addUser(firstname, lastname, address, email, password, city, zip, phone, age, callback) {
    connection.query('INSERT INTO users (firstname, lastname, address, email, password, city, zip, phone, age) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [firstname, lastname, address, email, password, city, zip, phone, age], (error, result) => {
      if (error) throw error;

      callback();
    });
  }
  deleteUser(id){
    connection.query('DELETE * FROM users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
  loginUser(email, password, callback){
    connection.query('SELECT id FROM users WHERE email = ? AND password =?', [email, password], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }
}
let userService = new UserService();

export {userService};
