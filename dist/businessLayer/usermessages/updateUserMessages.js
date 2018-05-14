const databaseSettting = require('../databaseSetting');
const changeUserMessageKey = require('../changeUserMessagesKey').changeUserMessageKey;
exports.updateUserMessages = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserMessageKey(key)!==null&&key!=='id'){
      tableKey.push(`${changeUserMessageKey(key)}='${params[key]}'`)
    }
  });
  let sql = `update usermessages set ${tableKey.join(',')} where UM_ID='${params.id}'`;
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
