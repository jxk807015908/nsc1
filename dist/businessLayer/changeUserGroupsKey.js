exports.changeUserGroupsKey=(n)=>{
  switch (n){
    case 'groupId':return 'UG_ID';
    case 'time':return 'UG_CreateTime';
    case 'adminId':return 'UG_AdminID';
    case 'name':return 'UG_Name';
    case 'icon':return 'UG_Icon';
    case 'notice':return 'UG_Notice';
    case 'intro':return 'UG_Intro';
    case 'creatorId':return 'UG_CreatorID';
    default:return null;
  }
};
