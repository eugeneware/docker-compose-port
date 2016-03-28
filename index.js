var exec = require('child_process').exec;

module.exports = dockerIpPort;
module.exports.dockerIpPort = dockerIpPort;
function dockerIpPort(machine, service, port) {
  if (arguments.length == 2) {
    port = service;
    service = machine;
    machine = 'default';
  }

  return Promise.all([
    dockerIp(machine),
    dockerPort(service, port)
  ])
    .then(function (result) {
      return {
        ip: result[0],
        port: result[1]
      };
    });
}

module.exports.dockerPort = dockerPort;
function dockerPort(service, port) {
  return new Promise(function (resolve, reject) {
    exec('docker-compose port ' + service + ' ' + port, function (err, stdout, stderr) {
      if (err) return reject(err);
      if (!stdout.trim()) return reject('Port ' + port + ' not published');
      resolve(parseInt(stdout.trim().split(':')[1], 10));
    });
  });
}

module.exports.dockerIp = dockerIp;
function dockerIp(machine) {
  var p;
  if (typeof machine === 'undefined') {
    p = new Promise(function (resolve, reject) {
      exec('docker-machine active', function (err, stdout, stderr) {
        if (err) return reject(err);
        resolve(stdout.trim());
      });
    });
  } else {
    p = Promise.resolve(machine);
  }

  return (
    p.then(function (machine) {
      return new Promise(function (resolve, reject) {
        exec('docker-machine ip ' + (machine || 'default'), function (err, stdout, stderr) {
          if (err) return reject(err);
          resolve(stdout.trim());
        });
      });
    })
  );
}
