const path = require("path");
const fs = require("fs");

//判断文件夹是否存在
function getStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
}

//获取copyWebpackPlugin可转移资源的文件夹
exports.getcopyDirectory = function (...values) {
  let arr = [];
  for (let val of values) {
    let directoryPath = path.resolve("./", `src/${val}`);
    getStat(directoryPath).then(res => {
      if (res) {
        arr.push({
          from: directoryPath,
          to: `./${val}`
        });
      }
    });
  }
  return arr;
};