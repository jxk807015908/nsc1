const databaseSettting = require('../databaseSetting');
const changeUserGroupsToUserKey=require('../changeUserGroupsToUserKey').changeUserGroupsToUserKey;
exports.deleteUserGroupsToUser = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserGroupsToUserKey(key)!==null){
      tableKey.push(`${changeUserGroupsToUserKey(key)}='${params[key]}'`)
    }
  });
  let sql = `DELETE FROM usergroupstouser WHERE ${tableKey.join(' and ')}`;
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
