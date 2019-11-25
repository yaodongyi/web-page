/*
 * @Author: yaodongyi
 * @Date: 2019-09-05 15:44:31
 * @Description: 信息提示
 */
let path = require('path');
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');
  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    });
  };
};
