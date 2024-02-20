import utils from '../scripts/utils';

function startDate(rawDate) {
    let date = new Date(rawDate);
    let startDate = new Date(date.setHours(0, 0, 0));
    return startDate;
}

function endDate(rawDate) {
    let date = new Date(rawDate);
    let startDate = new Date(date.setHours(24, 0, 0));
    return startDate;
}

class HolidayEventModel {
    constructor(data) {
        this.id = utils.generateEventID();
        this.title = data.localName;
        this.start = startDate(data.date);
        this.end = endDate(data.date);
        this.tags = [];
        this.colors = [];
        this.isDraggable = false;
        this.isPublicHoliday = true;
        this.allDay =  false;
        this.ignoreEvents = true;
    }
}

export default HolidayEventModel