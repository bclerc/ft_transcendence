import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidator {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null
  {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    if (password === passwordConfirm && (password !== null && passwordConfirm !== null))
    {
      return null;
    }
    else
    {
      return { passwordsMatching: true };
    }
  }
}