import utils from '../scripts/utils';

interface EventModel {
    id: string;
    title: string;
    start: Date;
    end: Date;
    tags: string[];
    colors: string[];
    isDraggable: boolean;
}

class EventModel {
    constructor(data: any) {
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