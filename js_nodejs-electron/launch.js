const { app, BrowserWindow } = require('electron');
const path = require('path');

const frontend = path.join(__dirname, 'frontend');
const images = path.join(frontend, 'images');
const pages = path.join(frontend, 'pages');

// TODO git and work for app and site version

/**
 * @param {number} w width
 * @param {number} h height
 * @param {string} file string path to html page
 */
function createWindow(params, file) {
    const window = new BrowserWindow(typeof params === 'object' ? params : undefined);
    if (typeof file === 'string') {
        window.loadFile(file);
    };
    return window;
};

app.on('window-all-closed', () => {
    app.quit()
})

app.whenReady().then(() => {
    const window = createWindow({ 'width': 900, 'height': 600, 'icon': path.join(images, 'favicon.png'), },
        path.join(pages,'home.html'));
    window.setMenuBarVisibility(false);
});