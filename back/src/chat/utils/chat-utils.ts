const argon2 = require('argon2');

export class PasswordUtils {
  
  constructor () {}

  async  hashPass (pass: string): Promise<string> {
    const hash = await argon2.hash(pass);
    return hash;
  }
  
  async  verifyPass(pass: string, hash: string): Promise<boolean> {
    if (pass === undefined || hash === undefined)
      return false;
    const isCorrect = await argon2.verify(hash, pass);
    return isCorrect;
  }

}
