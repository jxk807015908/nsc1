const searchFriend=require("../../businessLayer/myFriend/searchFriend");
exports.getFriend = (app) => {
    app.post('/getFriend.do', (req, res) => {
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
            searchFriend.searchFriend({userId:dataObject.userId},(result)=>{
              if (result==='error') {
                (!isSend)&&res.send({
                  code: 10000,
                  data: null,
                  msg: '查询用户表和好友表发生错误',
                  success: false
                })
              } else {
                (!isSend)&&res.send({
                  code: 10000,
                  data: result,
                  msg: '',
                  success: true
                })
              }
            });
        })
    });
};
