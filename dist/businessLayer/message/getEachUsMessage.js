const databaseSettting = require('../databaseSetting');
exports.getEachUsMessage = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql;
    if(params.pageNo !== undefined && params.pageSize !== undefined){
      sql = `SELECT * FROM Messages WHERE (M_FromUserID="${params.userId}" AND M_ToUserID="${params.friendId}" AND M_Time<"${params.openTime}") OR (M_FromUserID="${params.friendId}" AND M_ToUserID="${params.userId}") order by M_Time DESC limit ${(params.pageNo-1)*params.pageSize},${params.pageSize}`;
    }else{
      sql = `SELECT * FROM Messages WHERE (M_FromUserID="${params.userId}" AND M_ToUserID="${params.friendId}" AND M_Time<"${params.openTime}") OR (M_FromUserID="${params.friendId}" AND M_ToUserID="${params.userId}") order by M_Time DESC`;
    }
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
