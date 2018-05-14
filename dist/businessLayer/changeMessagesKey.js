exports.changeMessagesKey=(n)=>{
  switch (n){
    case 'id':return 'M_ID';
    case 'message':return 'M_PostMessages';
    case 'status':return 'M_Status';
    case 'time':return 'M_Time';
    case 'messageType':return 'M_MessageTypeID';
    case 'from':return 'M_FromUserID';
    case 'to':return 'M_ToUserID';
    case 'expressName':return 'M_ExpressName';
    case 'filePath':return 'M_FilePath';
    default:return null;
  }
};
