class EventModel {
    constructor(data) {
        this.title = data.title;
        this.start = new Date(data.start);
        this.end = new Date(data.end)
        this.tags = data.tags;
        this.colors = data.colors;
    }
}

export default EventModel