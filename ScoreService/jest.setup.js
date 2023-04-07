const app = require('./app');
const supertest = require('supertest');

global.app = app;
global.request = supertest(app);
