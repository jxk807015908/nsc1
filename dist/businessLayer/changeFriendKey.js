exports.changeFriendKey=(n)=>{
  switch (n){
    case 'id':return 'F_ID';
    case 'friendId':return 'F_FriendID';
    case 'userId':return 'F_UserID';
    case 'name':return 'F_Name';
    case 'friendTypeId':return 'F_FriendTypeID';
    case 'friendGroupsId':return 'F_FriendGroupsID';
    default:return null;
  }
};
