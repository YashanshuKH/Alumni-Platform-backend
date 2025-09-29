const path = require('path');
const express = require('express');
const eventRouter = express.Router();
const eventController = require('../Controllers/eventController');

eventRouter.get('/events', eventController.getEvents);
eventRouter.get('/events/:eventId', eventController.getEventById);
eventRouter.post('/events', eventController.createEvent);
eventRouter.put('/events/:eventId', eventController.updateEvent);
eventRouter.delete('/events/:eventId', eventController.deleteEvent);

module.exports = eventRouter;
