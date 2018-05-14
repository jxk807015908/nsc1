const selectGroupsMessage = require("../../businessLayer/groupsMessage/selectGroupsMessage");
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
    })
  });
};
