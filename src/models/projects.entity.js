export class ProjectsEntity
{
    constructor(id,name, description, image = [], tasks = [], members=[])
    {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.tasks = tasks;
        this.members = members;
    }



}