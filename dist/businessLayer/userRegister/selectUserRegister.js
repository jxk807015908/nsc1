const databaseSettting = require('../databaseSetting');
const changeUserRegisterKey = require('../changeUserRegisterKey').changeUserRegisterKey;
exports.selectUserRegister = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserRegisterKey(key)!==null&&key!=='expiryDate'){
      tableKey.push(`${changeUserRegisterKey(key)}='${params[key]}'`)
    }
  });
  let sql = `SELECT * FROM userregister WHERE ${tableKey.join(' and ')} and UR_ExpiryDate>=${params.expiryDate}`;
  console.log(sql);
  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      callback('error');
    } else {
      callback(result);
    }
  });
  connection.end()
};
