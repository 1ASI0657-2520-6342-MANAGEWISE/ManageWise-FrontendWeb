class EventEntity {
    constructor({ name, date, location, description, projectId}) {
        this.name = name;
        this.date = date;
        this.location = location;
        this.description = description;
        this.color = (Math.round(Math.random()))? "#74A38F" : "#98CFD7";
        this.projectId = projectId;
    }

}

export default EventEntity