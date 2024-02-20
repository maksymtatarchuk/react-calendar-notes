import utils from '../scripts/utils';

function startDate(rawDate: any) {
    let date = new Date(rawDate);
    let startDate = new Date(date.setHours(0, 0, 0));
    return startDate;
}

function endDate(rawDate: any) {
    let date = new Date(rawDate);
    let startDate = new Date(date.setHours(24, 0, 0));
    return startDate;
}

interface HolidayEventModel {
    id: string;
    title: string;
    start: Date;
    end: Date;
    tags: string[];
    colors: string[];
    isPublicHoliday: boolean;
    allDay: boolean;
    isDraggable: boolean;
    ignoreEvents: boolean;
}

class HolidayEventModel {
    constructor(data: any) {
        this.id = utils.generateEventID();
        this.title = data.localName;
        this.start = startDate(data.date);
        this.end = endDate(data.date);
        this.tags = [];
        this.colors = [];
        this.isDraggable = false;
        this.isPublicHoliday = true;
        this.allDay = false;
        this.ignoreEvents = true;
    }
}

export default HolidayEventModel