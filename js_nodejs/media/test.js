const fs = require('fs');
const http = require('http')

fs.readFile('./episode-01/media.m3u8', (err, data) => {
    const arr = String(data).split('\n');
    arr.forEach((v) => {
        if (v.includes('https') === false) { return; };
        fetch(v).then((res) => { return res.text(); }).then((res) => {
            fs.writeFile(`${__dirname}/episode-01/${v.split('/')[9]}`, res, () => { });
        });
    });
});