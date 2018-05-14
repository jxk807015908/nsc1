const databaseSettting = require('../databaseSetting');
const changeUserGroupsToUserKey=require('../changeUserGroupsToUserKey').changeUserGroupsToUserKey;
exports.selectUserGroupsToUser = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserGroupsToUserKey(key)!==null){
      tableKey.push(`${changeUserGroupsToUserKey(key)}='${params[key]}'`)
    }
  });
  let sql = `select * from usergroups,usergroupstouser where usergroupstouser.UGU_GroupID=usergroups.UG_ID and ${tableKey.join(' and ')}`;
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
