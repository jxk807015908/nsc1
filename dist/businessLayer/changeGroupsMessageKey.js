exports.changeGroupsMessageKey=(n)=>{
  switch (n){
    case 'id':return 'GM_ID';
    case 'groupId':return 'GM_GroupID';
    case 'message':return 'GM_Message';
    case 'messageType':return 'GM_MessageType';
    case 'fromId':return 'GM_FromID';
    case 'uName':return 'GM_FromUName';
    case 'time':return 'GM_CreateTime';
    case 'expressName':return 'GM_ExpressName';
    case 'filePath':return 'GM_FilePath';
    case 'status':return 'GM_Status';
    default:return null;
  }
};
