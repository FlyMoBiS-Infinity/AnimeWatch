const { Router } = require('express');
const path = require('path');
const fs = require('fs');

const projectPath = 'E:/Projects-VSCode/animewatch-js_nodejs';
const filesPath = projectPath + '/frontend';

const mimeTypes = {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.go': 'text/golang',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/icon',
    '.ts': 'video/mp2t',
};

const routersControl = {
    sendError: async (res) => {
        res.statusCode = 404;
        res.end();
    },
    setResHeader: async (res, mtype) => {
        res.setHeader('Content-type', mtype);
    },
    sendFile: async (url, res) => {
        if (res == undefined) { console.warn('res is undefined'); return };
        const pagesSplit = String(url).split('/');
        const extName = pagesSplit[pagesSplit.length - 1].slice(pagesSplit[pagesSplit.length - 1].indexOf('.'));

        const mtype = mimeTypes[extName];
        if (mtype == undefined) { await routersControl.sendError(res); return };
        await fs.readFile(filesPath + '/' + url, {}, async (error, data) => {
            if (error) {
                await routersControl.sendError(res);
            }
            else {
                res.statusCode = 200;
                await routersControl.setResHeader(res, mtype);
                res.end(data);
            };
        });
    },
    sendData: async (data, res) => {
        // TODO encode decode data
        res.json(data);
    },
    newRouter: () => {
        const router = new Router();
        return {
            get: (path, callback) => {
                router.get(path, async (req, res) => {
                    callback(req, res);
                })
            },
            post: (path, callback) => {
                router.post(path, async (req, res) => {
                    callback(req, res);
                });
            },
            getRouter: () => { return router },
        };
    },
};

module.exports = routersControl;