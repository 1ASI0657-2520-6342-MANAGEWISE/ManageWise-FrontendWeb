import { UserService } from "./user.service";
export class RegisterService {

  userService = new UserService();

  async validatePrimaryRegisterData(form, confirmPassword) {
    console.log("Validando datos de registro primarios:", form)
    const errors = {};

    const fieldsRequiredStep1 = ['firstName', 'lastName', 'email', 'password', 'role'];
    for (let field of fieldsRequiredStep1) {
      if (!form[field] || form[field].trim().length === 0) {
        errors[field] = `Field ${field} is required.`;
      }
    }

    if (form.email && !this.isValidEmail(form.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (form.password !== confirmPassword) {
      errors.password = 'Passwords do not match.';
    }



// Ejemplo de validación asíncrona: verificar si el correo ya está registrado

    /*
 if (form.email) {
      const emailExists = await this.checkEmailExists(form.email);
      if (emailExists) {
        errors.email = 'This email is already registered.';
      }
    }
      */


    return { valid: Object.keys(errors).length === 0, errors };
  }

    async validateSecondaryRegisterData(form) {
    console.log("Validando datos de registro secundarios:", form)

    const errors = {};
    let fieldsRequiredStep2 = [];

    if (form.role === 'director') {
      fieldsRequiredStep2 = ['companyName', 'companyEmail', 'companyCountry'];
    } else if (form.role === 'team') {
      fieldsRequiredStep2 = ['teamRegisterCode'];
    }

    for (let field of fieldsRequiredStep2) {
      if (!form[field] || form[field].trim().length === 0) {
        errors[field] = `Field ${field} is required.`;
      }
    }

    if (form.role === 'director' && form.companyEmail && !this.isValidEmail(form.companyEmail)) {
      errors.email = 'Please enter a valid company email address!.';
    }

   

    return { valid: Object.keys(errors).length === 0, errors };
  }

  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async signUpUser(form){
    console.log("Registrando usuario:", form)

     const roleMapping = {
    director: 0,
    team: 1
  };
  
    
    const role = roleMapping[form.role] || 0;

      const user = {
        firstName: form.firstName || '',
        lastName: form.lastName || '',
        age: 0,  
        email: form.email || '',
        phone: '',  
        password: form.password || '',
        profileImg: '',  
        role: role,
        companyName: form.companyName || '',
        companyEmail: form.companyEmail || '',
        companyCountry: form.companyCountry || '',
        teamRegisterCode: form.teamRegisterCode || ''
  };

 
    
    console.log('user to register', user)

    try {
      const response = await this.userService.signUpUser(user);
      return response;
    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      throw error;
    }
  }
}

