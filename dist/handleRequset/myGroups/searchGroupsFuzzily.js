const searchGroupsFuzzily = require("../../businessLayer/usergroups/searchGroupsFuzzily");
exports.searchGroupsFuzzily = (app) => {
  app.post('/searchGroupsFuzzily.do', (req, res) => {
    let isSend = false;
    res.setTimeout(3000, () => {
      isSend = true;
      res.send({
        code: 10000,
        data: null,
        msg: '连接超时',
        success: false
      });
    });
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      data = decodeURI(data);
      let dataObject = JSON.parse(data);
      Promise.all([searchGroupsFuzzilyFn({idOrName: dataObject.idOrName}), searchGroupsFuzzilyFn({
        idOrName: dataObject.idOrName,
        pageNo: dataObject.pageNo,
        pageSize: dataObject.pageSize
      })]).then(result => {
        (!isSend) && res.send({
          code: 10000,
          data: {
            result: result[1],
            total: result[0].length
          },
          msg: '',
          success: true
        })
      }).catch(()=>{
        (!isSend) && res.send({
          code: 10000,
          data:null,
          msg: '操作失败',
          success: false
        })
      });
    });
  })
};

function searchGroupsFuzzilyFn(obj) {
  return new Promise((resolve, reject) => {
    searchGroupsFuzzily.searchGroupsFuzzily(obj, (result) => {
      if (result === 'error') {
        reject();
      } else {
        resolve(result);
      }
    });
  });
}
