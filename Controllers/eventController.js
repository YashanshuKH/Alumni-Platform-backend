const { Event } = require('../models/Events');

const sendError = (res, code, msg) =>
  res.status(code).json({ success: false, message: msg });

const serverError = (res, err, msg = 'Server Error') => {
  console.error(err);
  sendError(res, 500, msg);
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    serverError(res, err, 'Failed to fetch events');
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return sendError(res, 404, 'Event not found');
    res.json({ success: true, data: event });
  } catch (err) {
    err.name === 'CastError'
      ? sendError(res, 400, 'Invalid Event ID')
      : serverError(res, err, 'Failed to fetch event');
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, message: 'Event created', data: event });
  } catch (err) {
    err.name === 'ValidationError'
      ? sendError(res, 400, err.message)
      : serverError(res, err, 'Failed to create event');
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return sendError(res, 404, 'Event not found');
    res.json({ success: true, message: 'Event updated', data: event });
  } catch (err) {
    err.name === 'CastError'
      ? sendError(res, 400, 'Invalid Event ID')
      : err.name === 'ValidationError'
      ? sendError(res, 400, err.message)
      : serverError(res, err, 'Failed to update event');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId);
    if (!event) return sendError(res, 404, 'Event not found');
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    err.name === 'CastError'
      ? sendError(res, 400, 'Invalid Event ID')
      : serverError(res, err, 'Failed to delete event');
  }
};
