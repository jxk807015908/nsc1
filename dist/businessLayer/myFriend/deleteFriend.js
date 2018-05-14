const databaseSettting = require('../databaseSetting');
const changeFriendKey = require('../changeFriendKey').changeFriendKey;
exports.deleteFriend = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeFriendKey(key)!==null){
      tableKey.push(`${changeFriendKey(key)}='${params[key]}'`)
    }
  });
  let sql = `delete from friends where ${tableKey.join(' and ')}`;
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
