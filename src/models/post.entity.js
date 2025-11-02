class Post {
    constructor(id,
    title,
    subject,
    description,
    email,
    userId,
    userName,
    userImage,
    companyId,
    postTime,
    rating,
    images = [],
    commentsList = []) {
        this.id = id;
    this.title = title;
    this.subject = subject;
    this.description = description;
    this.email = email;
    this.userId = userId;
    this.userName = userName;
    this.userImage = userImage;
    this.companyId = companyId;
    this.postTime = postTime;
    this.rating = rating;
    this.images = images;
    this.commentsList = commentsList;
  
    }
}

export default Post;