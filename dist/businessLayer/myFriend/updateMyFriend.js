const databaseSettting = require('../databaseSetting');
const changeFriendKey = require('../changeFriendKey').changeFriendKey;
exports.updateMyFriend = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeFriendKey(key)!==null&&!['friendId','userId'].includes(key)){
      tableKey.push(`${changeFriendKey(key)}='${params[key]}'`)
    }
  });
  let sql = `update friends set ${tableKey.join(',')} where F_FriendID='${params.friendId}' and F_UserID='${params.userId}'`;
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
