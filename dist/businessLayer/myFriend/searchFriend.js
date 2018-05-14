const databaseSettting = require('../databaseSetting');
const changeFriendKey=require('../changeFriendKey').changeFriendKey;
const changeUserKey=require('../changeUserKey').changeUserKey;
exports.searchFriend = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let sql = `SELECT * FROM friends,user WHERE friends.F_FriendID=user.U_LoginID`;
  if (params.userId) {
    sql += ` and friends.F_UserID="${params.userId}"`;
  };
  // let tableKey = [];
  // Object.keys(params).forEach(key => {
  //   if (params[key] !== null && changeFriendKey(key) !== null) {
  //     tableKey.push(`friends.${changeFriendKey(key)}='${params[key]}'`)
  //   }
  //   if (params[key] !== null && changeUserKey(key) !== null) {
  //     tableKey.push(`user.${changeUserKey(key)}='${params[key]}'`)
  //   }
  // });
  // let sql;
  // if(tableKey.length === 0){
  //   sql = `SELECT * FROM friends,user WHERE friends.F_FriendID=user.U_LoginID`;
  // }else{
  //   sql = `SELECT * FROM friends,user WHERE friends.F_FriendID=user.U_LoginID and ${tableKey.join(' and ')}`;
  // }
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
