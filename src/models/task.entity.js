export class TaskEntity
{
    constructor(id, title, assigned,due,status, assignedID, description) {
        this.id = id;
        this.title = title;
        this.assigned = assigned;
        this.assignedID = assignedID;
        this.due = due;
        this.state = status;
        this.description = description;
    }
}