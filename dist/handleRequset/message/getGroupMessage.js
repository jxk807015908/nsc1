const selectGroupsMessage = require("../../businessLayer/groupsMessage/selectGroupsMessage");
const updateUserMessages2 = require("../../businessLayer/usermessages/updateUserMessages2");
const selectUserGroupsToUser2 = require("../../businessLayer/usergroupstouser/selectUserGroupsToUser2");
const fs=require('fs');
const path=require('path');
exports.getGroupMessage = (app) => {
  app.post('/getGroupMessage.do', (req, res) => {
    let isSend = false;
    let timer;
    res.setTimeout(3000, () => {
      isSend = true;
      res.send({
        code: 10000,
        data: null,
        msg: '连接超时',
        success: false
      });
      timer&&clearInterval(timer);
    });
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      data = decodeURI(data);
      let total = 0;
      let dataObject = JSON.parse(data);
      selectUserGroupsToUser2Fn({
        groupId:dataObject.groupId
      }).then(result3=>{
        // console.log("sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
        // console.log(result3)
        if(result3.some(obj=>obj.UGU_UserID===dataObject.userId)){
          updateUserMessages2Fn({
            update:{
              tipNum:0
            },
            select:{
              fromId:dataObject.groupId,
              toId:dataObject.userId,
              messageType:'1',
              remark:'group'
            }
          });
          selectGroupsMessage.selectGroupsMessage({
            openTime: dataObject.openTime,
            groupId: dataObject.groupId
          }, (result) => {
            if (result === 'error') {
              (!isSend) && res.send({
                code: 10000,
                data: null,
                msg: '查询用户表和好友表发生错误',
                success: false
              })
            } else {
              total = result.length;
            }
          });
          selectGroupsMessage.selectGroupsMessage({
            openTime: dataObject.openTime,
            pageNo: dataObject.pageNo,
            pageSize: dataObject.pageSize,
            groupId: dataObject.groupId
          }, (result) => {
            if (result === 'error') {
              (!isSend) && res.send({
                code: 10000,
                data: null,
                msg: '查询用户表和好友表发生错误',
                success: false
              })
            } else {
              let imgPath=path.join(__dirname+'../../../data/express');
              let imgNumber=0;
              //(async ()=>{
              result.forEach((obj,index)=>{
                if(obj.GM_ExpressName){
                  let expressNameArr=obj.GM_ExpressName.split(',');
                  imgNumber+=expressNameArr.length;
                  expressNameArr.forEach(value => {
                    if(fs.existsSync(imgPath+'/'+value+'.gif')){
                      fs.readFile(imgPath+'/'+value+'.gif', function (err, imgData) {
                        if(err){
                          return console.error(err);
                        }
                        if(!result[index].expressArr){
                          result[index].expressArr=[];
                        }
                        result[index].expressArr.push({img:imgData.toString('base64'),name:value})
                        imgNumber--;
                      })
                    }else{
                      fs.readFile(imgPath+'/'+value+'.jpg', function (err, imgData) {
                        if(err){
                          return console.error(err);
                        }
                        if(!result[index].expressArr){
                          result[index].expressArr=[];
                        }
                        result[index].expressArr.push({img:imgData.toString('base64'),name:value})
                        imgNumber--;
                      })
                    }
                  })
                }
              });
              //})();
              timer=setInterval(()=>{
                if(imgNumber===0){
                  (!isSend)&&res.send({
                    code: 10000,
                    data: result,
                    msg: '',
                    total: total,
                    success: true
                  });
                  clearInterval(timer);
                }
              },50)
            }
          });
        }else{
          (!isSend) && res.send({
            code: 1,
            data: null,
            msg: '你不是该群成员',
            success: false
          })
        }
      });

    })
  });
};
function updateUserMessages2Fn(obj) {
  return new Promise((resolve, reject) => {
    updateUserMessages2.updateUserMessages2(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
function selectUserGroupsToUser2Fn(obj) {
  return new Promise((resolve, reject) => {
    selectUserGroupsToUser2.selectUserGroupsToUser2(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
