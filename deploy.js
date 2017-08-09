var path, node_ssh, ssh, fs, config

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh();

try {
  config = JSON.parse(fs.readFileSync('config.json'));
}
catch (e) {
  console.error(e);
}

var fileName = config.prefix + "_v" + config.version + ".zip";

if (fs.existsSync(config.sourcePath + fileName)) {
  ssh.connect({
    host: config.remote,
    username: config.username,
    privateKey: config.privateKey

  }).then(function () {
    ssh.execCommand('pwd').then(function (result) {
      console.log('STDOUT: ' + result.stdout);
    })
  }, function (err) {
    console.log(err);
    ssh.dispose();
  }).then(() => {

    return ssh.putFiles([
      { local: config.sourcePath + fileName, remote: config.destinationPath + fileName },
      { local: config.sourcePath + 'run.sh', remote: config.destinationPath + 'run.sh' }
    ]).then(function () {
      console.log("The File thing is done");
      return;
    }, function (error) {
      console.log("Something's wrong");
      console.log(error);
      ssh.dispose();
    })
  }).then(() => {
    let shell = "sudo sh " + config.destinationPath + "run.sh" + " " + config.serviceName + " " + config.serviceRunFolder + " " + fileName ;
    //let shell = "pwd";
    ssh.execCommand(shell).then((result) => {
      console.log('STDOUT: ' + result.stdout);
      ssh.dispose();
    })
  }, (err) => {
    console.log(err);
    ssh.dispose();
  })
}


