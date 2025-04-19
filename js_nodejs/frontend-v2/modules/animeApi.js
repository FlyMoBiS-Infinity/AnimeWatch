import network from './network.js';

const request = new network({'method': 'GET', 'timeout': 30000, 'url': ''});

request.options({'url': ''});