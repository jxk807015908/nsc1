const fs=require('fs');
const path=require('path');
exports.getExpress = (app) => {
    app.post('/getExpress.do', (req, res) => {
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
            //let files=fs.readdirSync(path.join(__dirname+'../../../data/express'));
            let imgPath=path.join(__dirname+'../../../data/express');
            //方法1 图片名前端指向静态数据
            fs.readdir(imgPath, (err,files)=>{
              // console.log('------------------------');
              // console.log(files)
              (!isSend)&&res.send({
                code: 10000,
                data: files,
                msg: '',
                success: true
              });
            });
            //方法2 直接传图片数据
            // let imgs=[];
            // console.log(fs.existsSync(imgPath+'/'+dataObject.userId+'-'+1+'.jpg'));
            // let imgNumber=0;
            // (async ()=>{
            //   for(let i=1;fs.existsSync(imgPath+'/base'+i+'.gif');i++){
            //     await new Promise(resolve => {
            //       fs.readFile(imgPath+'/base'+i+'.gif', function (err, imgData) {
            //         if (err) {
            //           return console.error(err);
            //         }
            //         imgs.push({img:imgData.toString('base64'),name:'base'+i});
            //         //imgs.push(imgData.toString());
            //         //console.log(i)
            //         resolve()
            //         //console.log("异步读取: " + imgData.toString());
            //       });
            //     })
            //   }
            //   for(let i=1;fs.existsSync(imgPath+'/'+dataObject.userId+'-'+i+'.jpg');i++){
            //     await new Promise(resolve => {
            //       fs.readFile(imgPath+'/'+dataObject.userId+'-'+i+'.jpg', function (err, imgData) {
            //         if (err) {
            //           return console.error(err);
            //         }
            //         imgs.push({img:imgData.toString('base64'),name:dataObject.userId+'-'+i});
            //         //imgs.push(imgData.toString());
            //         //console.log(i)
            //         resolve()
            //         //console.log("异步读取: " + imgData.toString());
            //       });
            //     })
            //   }
            //   //console.log(imgs)
            //   (!isSend)&&res.send({
            //     code: 10000,
            //     data: imgs,
            //     msg: '',
            //     success: true
            //   });
            // })();
        })
    });
};
