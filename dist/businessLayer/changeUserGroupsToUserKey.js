exports.changeUserGroupsToUserKey=(n)=>{
  switch (n){
    case 'id':return 'UGU_ID';
    case 'userId':return 'UGU_UserID';
    case 'groupId':return 'UGU_GroupID';
    case 'time':return 'UGU_CreateTime';
    case 'groupNick':return 'UGU_GroupNick';
    case 'authority':return 'UGU_Authority';
    default:return null;
  }
};
