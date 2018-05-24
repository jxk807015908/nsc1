const fs = require('fs');
const path = require('path');
exports.downloadFile = (app, connection) => {
  app.get('/downloadFile.do', function (req, res) {
    let filename = req.query.filePath;
    let filepath = path.join(__dirname, '/../../data' + filename);
    let stats = fs.statSync(filepath);
    if (stats.isFile()) {
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + filename,
        "Content-Length": stats.size
      });
      fs.createReadStream(filepath).pipe(res);
    } else {
      res.end(404);
    }
  });
}
