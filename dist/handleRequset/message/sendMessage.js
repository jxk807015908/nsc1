const insertMessage=require("../../businessLayer/message/insertMessage");
exports.sendMessage = (app) => {
    app.post('/sendMessage.do', (req, res) => {
        let isSend=false;
        res.setTimeout(3000,()=>{
          isSend=true;
          res.send({
            code:10000,
            data:null,
            msg:'连接超时',
            success:false
          });
        });
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = decodeURI(data);
            let dataObject = JSON.parse(data);
            insertMessage.insertMessage({
              messageType:dataObject.messageType,
              message:dataObject.message,
              status:0,
              time:`${new Date().getTime()}`,
              from:dataObject.from,
              to:dataObject.to,
              expressName:dataObject.expressName
            },(result)=>{
              if (result==='error') {
                (!isSend)&&res.send({
                  code: 10000,
                  data: null,
                  msg: '发生错误',
                  success: false
                })
              } else {
                (!isSend)&&res.send({
                  code: 10000,
                  data: null,
                  msg: '',
                  success: true
                })
              }
            })
        })
    });
};
