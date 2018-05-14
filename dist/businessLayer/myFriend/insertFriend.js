const databaseSettting = require('../databaseSetting');
exports.insertFriend = (params, callback) => {
    let connection = databaseSettting.databaseSettting();
    let sql = `insert into friends(F_FriendID,F_UserID,F_FriendGroupsID) value ('${params.userId}','${params.friendId}','${params.groupId}')`;
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
