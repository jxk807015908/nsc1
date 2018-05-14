const databaseSettting = require('../databaseSetting');
exports.searchGroupsFuzzily = (params, callback) => {
  let connection = databaseSettting.databaseSettting();
  let sql=`SELECT * FROM usergroups WHERE UG_ID like "%${params.idOrName}%" or UG_Name like "%${params.idOrName}%"`;
  // let i=0;
  // Object.keys(params).forEach(key=>{
  //   if(changeToTableKey(key)){
  //     if(i!==0){
  //       sql+=' and';
  //     }
  //     sql+=` ${changeToTableKey(key)}="${params[key]}"`;
  //     i=1;
  //   }
  // });

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
