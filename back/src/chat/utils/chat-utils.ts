const argon2 = require('argon2');

export class PasswordUtils {
  
  constructor () {}

  async  hashPass (pass: string): Promise<string> {
    if (pass === undefined)
      return '';
    const hash = await argon2.hash(pass);
    return hash;
  }

  async  verifyPass(pass: string, hash: string): Promise<boolean> {
    if (!pass || !hash)
      return false;
    const isCorrect = await argon2.verify(hash, pass);
    return isCorrect;
  }
}
