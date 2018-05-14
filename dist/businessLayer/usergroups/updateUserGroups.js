const databaseSettting = require('../databaseSetting');
const changeUserGroupsKey = require('../changeUserGroupsKey').changeUserGroupsKey;
exports.updateUserGroups = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserGroupsKey(key)!==null&&key!=='groupId'){
      tableKey.push(`${changeUserGroupsKey(key)}='${params[key]}'`)
    }
  });
  let sql = `update usergroups set ${tableKey.join(',')} where UG_ID='${params.groupId}'`;
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
