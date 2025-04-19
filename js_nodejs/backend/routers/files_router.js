const RC = require('./routersControl.js');

let router = RC.newRouter();

router.get('/frontend/:folder/:file', (req, res) => {
    const folder = String(req.params.folder).toLocaleLowerCase('en-US');
    const file = String(req.params.file).toLocaleLowerCase('en-US');
    RC.sendFile(folder + '/' + file, res);
});

module.exports = router.getRouter();