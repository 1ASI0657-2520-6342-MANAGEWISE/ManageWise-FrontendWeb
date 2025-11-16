import { UserService } from "./user.service";

export class RegisterService {
  userService = new UserService();

  async validatePrimaryRegisterData(form, confirmPassword) {
    const errors = {};
    const fieldsRequiredStep1 = ["firstName", "lastName", "email", "password", "role"];

    for (const field of fieldsRequiredStep1) {
      const val = (form[field] ?? "").toString().trim();
      if (!val.length) errors[field] = `Field ${field} is required.`;
    }

    if (form.email && !this.isValidEmail(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if ((form.password ?? "") !== (confirmPassword ?? "")) {
      errors.password = "Passwords do not match.";
    }

    // Si quieres validación async de correo duplicado, ponla aquí

    return { valid: Object.keys(errors).length === 0, errors };
  }

  async validateSecondaryRegisterData(form) {
    const errors = {};
    let fieldsRequiredStep2 = [];

    if (form.role === "director") {
      fieldsRequiredStep2 = ["companyName", "companyEmail", "companyCountry"];
    } else if (form.role === "team") {
      fieldsRequiredStep2 = ["teamRegisterCode"];
    }

    for (const field of fieldsRequiredStep2) {
      const val = (form[field] ?? "").toString().trim();
      if (!val.length) errors[field] = `Field ${field} is required.`;
    }

    if (
        form.role === "director" &&
        form.companyEmail &&
        !this.isValidEmail(form.companyEmail)
    ) {
      errors.email = "Please enter a valid company email address!.";
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  isValidEmail(email) {
    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Envía el signup al backend.
   * Devuelve la respuesta de axios (resp.status 201/200 al éxito).
   * Lanza error con mensaje legible si falla.
   */
  async signUpUser(form) {
    // Mapear rol a número
    const roleMapping = { director: 0, team: 1 };
    const role = roleMapping[form.role] ?? 0;

    // Normalizar payload (trim y defaults)
    const user = {
      firstName: (form.firstName ?? "").toString().trim(),
      lastName: (form.lastName ?? "").toString().trim(),
      age: Number(form.age ?? 0),
      email: (form.email ?? "").toString().trim(),
      phone: (form.phone ?? "").toString().trim(),
      password: (form.password ?? "").toString(),
      profileImg: (form.profileImg ?? "").toString().trim(),
      role: role,
      companyName: (form.companyName ?? "").toString().trim(),
      companyEmail: (form.companyEmail ?? "").toString().trim(),
      companyCountry: (form.companyCountry ?? "").toString().trim(),
      teamRegisterCode: (form.teamRegisterCode ?? "").toString().trim(),
    };

    try {
      const response = await this.userService.signUpUser(user);
      // response es el objeto de axios (status, data, etc.)
      return response;
    } catch (error) {
      // Propaga un error legible para el componente
      const message =
          error?.response?.data ??
          error?.message ??
          "Error inesperado al registrar.";
      console.error("Error al registrar el usuario:", message);
      throw new Error(message);
    }
  }
}
