const changeUserKey = require('../changeUserKey').changeUserKey;
const databaseSettting = require('../databaseSetting');
exports.insertNewUser = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  // let sql = `INSERT INTO User (U_LoginID,U_PassWord,U_Email) VALUES ('${params.userId}','${params.password}','${params.email}')`;
  let front = [];
  let behind = [];
  Object.keys(params).forEach(key => {
    if (params[key] != null && changeUserKey(key) !== null) {
      front.push(changeUserKey(key));
      behind.push(`'${params[key]}'`);
    }
  });
  let sql = `insert into User(${front.join(',')}) value (${behind.join(',')})`;
  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      callback('error');
    } else {
      callback(result);
    }
  });
  console.log(sql)
  connection.end()
};
