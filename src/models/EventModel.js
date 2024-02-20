import utils from '../scripts/utils';

class EventModel {
    constructor(data) {
        this.id = utils.generateEventID();
        this.title = data.title;
        this.start = new Date(data.start);
        this.end = new Date(data.end)
        this.tags = data.tags;
        this.colors = data.colors;
        this.isDraggable = true;
    }
}

export default EventModel