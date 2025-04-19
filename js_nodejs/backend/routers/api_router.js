const RC = require('./routersControl.js');

let router = RC.newRouter();

router.get('/api', (req, res) => {
    res.end('true')
});

module.exports = router.getRouter();