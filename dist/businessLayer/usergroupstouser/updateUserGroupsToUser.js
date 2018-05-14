const databaseSettting = require('../databaseSetting');
const changeUserGroupsToUserKey = require('../changeUserGroupsToUserKey').changeUserGroupsToUserKey;
exports.updateUserGroupsToUser = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserGroupsToUserKey(key)!==null&&!['groupId','userId'].includes(key)){
      tableKey.push(`${changeUserGroupsToUserKey(key)}='${params[key]}'`)
    }
  });
  let sql = `update usergroupstouser set ${tableKey.join(',')} where UGU_GroupID='${params.groupId}' and UGU_UserID='${params.userId}'`;
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
