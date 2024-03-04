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
        this.title = data && data.title || '';
        this.start = data && data.start ? new Date(data.start) : new Date();
        this.end = data && data.end ? new Date(data.end) : new Date();
        this.tags = data && data.tags || [];
        this.colors = data && data.colors || [];
        this.isDraggable = true;
    }
}

export default EventModel