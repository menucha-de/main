import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  private returnUrl: string;
  formPass: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    this.formPass = this.fb.group({
      password: ['', Validators.required],
      confirmPass: ['', this.passwordMatcher.bind(this)]
    });
    this.formPass.valueChanges.subscribe(field => {
      if (field.password !== field.confirmPass) {
        this.formPass.get('confirmPass').setErrors({ mismatch: true });
      } else {
        this.formPass.get('confirmPass').setErrors(null);
      }
    });
  }
  private passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (
      this.formPass &&
      (control.value !== this.formPass.controls.password.value)
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }
  onSubmit() {
    if (this.formPass.valid) {
      this.userService.changePassword(this.formPass.get('password').value).subscribe(() => {
        this.userService.passwordChanged = true;
        this.router.navigate([this.returnUrl]);
      });
    }
  }
}
