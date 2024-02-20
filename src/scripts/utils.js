import { v4 as uuidv4 } from 'uuid';
import eventsData from '../data/events.js';
import EventModel from '../models/EventModel.js';

function generateEventID() {
    return 'UUID-'+ uuidv4();
}

function getEvents() {
    return eventsData.map(event => new EventModel(event))

}

export default  {
    generateEventID,
    getEvents
}