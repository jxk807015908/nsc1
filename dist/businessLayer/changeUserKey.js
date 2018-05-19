exports.changeUserKey=(n)=>{
  switch (n){
    case 'userId':return 'U_LoginID';
    case 'nickName':return 'U_NickName';
    case 'password':return 'U_PassWord';
    case 'sex':return 'U_Sex';
    case 'birthday':return 'U_Birthday';
    case 'phone':return 'U_Telephone';
    case 'name':return 'U_Name';
    case 'email':return 'U_Email';
    case 'age':return 'U_Age';
    case 'friendPolicyId':return 'U_FriendshipPolicyID';
    case 'status':return 'U_UserStateID';
    case 'friendPolicyQuestion':return 'U_FriendPolicyQuestion';
    case 'friendPolicyAnswer':return 'U_FriendPolicyAnswer';
    case 'friendPolicyPassword':return 'U_FriendPolicyPassword';
    case 'messagePush':return 'U_MessagePush';
    default:return null;
  }
};
