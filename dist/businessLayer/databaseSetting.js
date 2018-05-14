exports.databaseSettting=()=>{
  const mysql=require('mysql');
  const connection=mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'gw19950912',
    database:'nsc',
  });
  connection.connect();
  return connection;
};
