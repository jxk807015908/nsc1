const databaseSettting = require('../databaseSetting');
exports.getFriendGroup = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql = `SELECT FG_ID,FG_Name FROM friendgroups WHERE`;
    let i = 0;
    if (params.userId) {
        if (i !== 0) {
            sql += ' and';
        }
        sql += ` FG_UserID="${params.userId}"`;
        i++;
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
