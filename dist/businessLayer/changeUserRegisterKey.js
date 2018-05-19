exports.changeUserRegisterKey=(n)=>{
  switch (n){
    case 'id':return 'UR_ID';
    case 'uid':return 'UR_Uid';
    case 'registerId':return 'UR_RegisterId';
    case 'password':return 'UR_Password';
    case 'email':return 'UR_Email';
    case 'expiryDate':return 'UR_ExpiryDate';
    default:return null;
  }
};
