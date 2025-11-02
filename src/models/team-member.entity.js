class TeamMemberEntity {
    constructor({id, profileImg, firstName, lastName, email, description }) {
        this.id = id;
        this.image = profileImg || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg';
        this.name = firstName + " " + lastName;
        this.email = email;
        this.description = description;
    }
}

export default TeamMemberEntity;