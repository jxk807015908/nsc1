const databaseSettting = require('../databaseSetting');
exports.deleteGroup = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql = `DELETE FROM friendgroups WHERE FG_ID=${params.groupId}`;
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
