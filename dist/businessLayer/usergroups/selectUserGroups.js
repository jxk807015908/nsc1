const databaseSettting = require('../databaseSetting');
const changeUserGroupsKey=require('../changeUserGroupsKey').changeUserGroupsKey;
exports.selectUserGroups = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let tableKey=[];
  Object.keys(params).forEach(key=>{
    if(params[key]!==null&&changeUserGroupsKey(key)!==null){
      tableKey.push(`${changeUserGroupsKey(key)}='${params[key]}'`)
    }
  });
  let sql = `select * from usergroups where ${tableKey.join(' and ')}`;
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
