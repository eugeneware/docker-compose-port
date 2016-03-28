var it = require('tape'),
    request = require('request'),
    dockerComposePort = require('..'),
    dockerIp = dockerComposePort.dockerIp,
    dockerPort = dockerComposePort.dockerPort;

var ipRegExp = /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/;

var _server = null;
it('should be able to connect to the web server', function(t) {
  t.plan(2);
  dockerComposePort('www', 80)
    .then(function (server) {
      t.assert(ipRegExp.test(server.ip), 'should be an ip');
      _server = server;
      request.get('http://' + server.ip + ':' + server.port + '/',
        function (err, res, body) {
          if (err) return t.error(err);
          t.assert(~body.indexOf('<h1>Welcome to nginx!</h1>'), 'valid response');
        });
    });
});

it('should be able to get an ip', function(t) {
  t.plan(2);
  dockerIp()
    .then(function (ip) {
      t.assert(ipRegExp.test(ip), 'should be an ip');
      t.equal(ip, _server.ip, 'should be the correct ip');
    });
});

it('should be able to get a port', function(t) {
  t.plan(1);
  dockerPort('www', 80)
    .then(function (port) {
      t.equal(port, _server.port, 'should be the correct port');
    });
});
