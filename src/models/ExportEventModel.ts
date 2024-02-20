interface ExportEventModel {
    title: string;
    start: Date;
    end: Date;
    tags: string[];
    colors: string[];
}

class ExportEventModel {
    constructor(data: any) {
        this.title = data.title;
        this.start = new Date(data.start);
        this.end = new Date(data.end)
        this.tags = data.tags;
        this.colors = data.colors;
    }
}

export default ExportEventModel