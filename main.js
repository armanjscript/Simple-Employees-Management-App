// Import required electron modules  
const querystring = require('querystring');       
const electronApp = require('electron').app;
const electronBrowserWindow = require('electron').BrowserWindow;
const {Management} = require('./database/management');

// Import required Node modules
const nodeExpress = require('express');
const nodePath = require('path');

// Start Express server
const appExpress = nodeExpress();

appExpress.set('view engine', 'pug')
appExpress.set('views', nodePath.join(__dirname, 'views'));
appExpress.use(nodeExpress.static(nodePath.join(__dirname, 'public')));
appExpress.use(nodeExpress.json());
appExpress.use(nodeExpress.urlencoded({extended: true}));

// Set route(s)
appExpress.get('/', async (req, res) => {
    message_handler = new Management();
    message_handler.getAll().then((result) => {
        res.render('homepage', {title: 'Management System', message: result.message, items: result.items, edit_message: req.query.notification});
    });
});

appExpress.get('/add-employee', (req, res) => {
    res.render('add-employee', {title: 'Add employee'});
});

appExpress.post('/add-employee', (req, res) => {
    message_handler = new Management(req.body);
    message_handler.add_employee().then((result) =>{
        res.render('add-employee', {title: 'Add employee', message: result.message});
    });
});

appExpress.get('/edit-employee/:id', (req, res) => {
    message_handler = new Management();
    message_handler.getEmployee(req.params['id']).then((result)=>{
        res.render('add-employee', {title: 'Edit employee', item: result.item, message: result.message});
    });
});

appExpress.post('/edit-employee/:id', (req, res) => {
    message_handler = new Management(req.body);
    message_handler.updateEmployee(req.params['id']).then((result)=>{
        const query = querystring.stringify({
            "notification": result.edit_message,
        });
        res.redirect(
            '/?' + query
        );
    });
});

appExpress.get('/delete-employee/:id', (req, res) =>{
    message_handler = new Management();
    message_handler.deleteEmployee(req.params['id']).then((result)=>{
        const query = querystring.stringify({
            "notification": result.edit_message,
        });
        res.redirect(
            '/?' + query
        );
    });
});

// Prevent garbage collection
let window;

function createWindow() {
    window = new electronBrowserWindow({
        autoHideMenuBar: true,
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: nodePath.join(__dirname, 'preload.js')
        }
    });

    // Using 'listen' callback, once server is ready, load the URL and show the window.
    appExpress.listen(3000, () => {
        window.loadURL('http://localhost:3000')
            .then(() => { window.show(); });
    });

    return window;
}

electronApp.on('ready', () => {
    window = createWindow();
});

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
});

electronApp.on('activate', () => {
    if (electronBrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});