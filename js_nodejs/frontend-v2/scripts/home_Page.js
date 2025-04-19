import request from '/frontend/modules/network.js';

const req = new request;

req.sendSafe(undefined, undefined, undefined, 'xhr').then(async (info) => {
    if (info['mode'] === 'xhr') {
        console.log(info['response'].target.response)
    }
    else if (info['mode'] === 'fetch') {
        console.log(await info['response'].json());
    };
}, (info) => {
    console.log('f', info.error, info.mode);
});