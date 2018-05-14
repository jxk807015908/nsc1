const databaseSettting = require('../databaseSetting');
const changeUserGroupsKey=require('../changeUserGroupsKey').changeUserGroupsKey;
exports.deleteUserGroups = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserGroupsKey(key)!==null){
      tableKey.push(`${changeUserGroupsKey(key)}='${params[key]}'`)
    }
  });
  let sql = `DELETE FROM usergroups WHERE ${tableKey.join(' and ')}`;
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
