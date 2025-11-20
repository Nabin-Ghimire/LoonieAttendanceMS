import bcrypt from "bcryptjs";

class CredentialService {
  async matchPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default CredentialService;