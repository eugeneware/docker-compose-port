# docker-compose-port

Find the ip and port of a docker-compose service

This is super-useful if you want to use docker-compose locally to run servers,
but want to be able to easily find the real IP and Port to connect to them.

## Installation

This module is installed via npm:

``` bash
$ npm install docker-compose-port
```

## Notes

This module expects `docker-machine` and `docker-compose` to be in your `$PATH`.

## Example Usage

Say you have a web server defined in your `docker-compose.yml` file:

``` yaml
# docker-compose.yml
www:
  image: nginx
  ports:
    - 80
  environment:
    NGINX_PORT: "80"
```

To get the IP and port to connect to it from your node code:

``` js
var dockerComposePort = require('docker-compose-port'),
    request = require('request');

dockerComposePort('www', 80)
  .then(function (server) {
    request.get('http://' + server.ip + ':' + server.port + '/',
      function (err, res, body) {
        if (err) throw err;
        console.log(body);
        // ... <h1>Welcome to nginx!</h1> ...
      });
  });
```

By default it will connect to your active docker-machine host.

You can tell it to connect to a different docker-machine host by passing that
through as the initial parameter.

``` js
var dockerComposePort = require('docker-compose-port'),
    request = require('request');

// connect to dev server in AWS
dockerComposePort('dev-aws', 'www', 80)
  .then(function (server) {
    request.get('http://' + server.ip + ':' + server.port + '/',
      function (err, res, body) {
        if (err) throw err;
        console.log(body);
        // ... <h1>Welcome to nginx!</h1> ...
      });
  });
```

## API

### dockerComposePort(`[machine]`, `service`, `port`)

Connect to the specified docker-compose `machine`, `service` and `port`.

If `machine` is not provided, it will default to the "active" docker machine.

### dockerIp(`[machine]`)


Get the IP of a given docker-machine.

If `machine` is not provided, it will default to the "active" docker machine.

Eg:

``` js
var dockerIp = require('docker-compose-port').dockerIp;
dockerIp()
  .then(console.log);
// 192.168.99.200j
```

### dockerPort(`service`, `port`)

Gets the actual port for the service on the active docker host.

Eg:

``` js
var dockerPort = require('docker-compose-port').dockerPort;
dockerPort('www', 80)
  .then(console.log);
// 32774
```
