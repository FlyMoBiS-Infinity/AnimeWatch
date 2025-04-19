const RC = require('./routersControl.js');

let router = RC.newRouter();

router.get('/', (req, res) => {
    RC.sendFile('pages/home.html', res);
});
router.get('/player', (req, res) => {
    RC.sendFile('pages/player.html', res);
});

module.exports = router.getRouter();