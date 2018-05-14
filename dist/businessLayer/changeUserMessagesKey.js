exports.changeUserMessageKey=(n)=>{
  switch (n){
    case 'fromId':return 'UM_FromID';
    case 'fromName':return 'UM_FromName';
    case 'toId':return 'UM_ToID';
    case 'messageType':return 'UM_MessageType';
    case 'isRead':return 'UM_IsRead';
    case 'message':return 'UM_Message';
    case 'time':return 'UM_Time';
    case 'remark':return 'UM_Remark';
    case 'tipNum':return 'UM_TipNum';
    case 'id':return 'UM_ID';
    default:return null;
  }
};
