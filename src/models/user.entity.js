export class User {
    constructor(id, firstName, lastName, age, email, phone, password, profileImg, role, companyName, companyEmail, companyCountry, teamRegisterCode) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.profileImg = profileImg;
        this.role = role;
        this.companyName = companyName;
        this.companyEmail = companyEmail;
        this.companyCountry = companyCountry;
        this.teamRegisterCode = teamRegisterCode;
    }
}