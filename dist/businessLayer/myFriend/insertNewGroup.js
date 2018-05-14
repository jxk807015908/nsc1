const databaseSettting = require('../databaseSetting');
exports.insertNewGroup = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql=`INSERT INTO friendgroups (FG_Name,FG_UserID) VALUES ('${params.groupName}','${params.userId}')`;
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
