import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Auth {
  user: string;
  pass: string;
}
@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {
  form: FormGroup;
  user: string;
  pass: string;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Auth
  ) {
    this.user = data.user;
    this.pass = data.pass;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      user: [this.user, []],
      pass: [this.pass, []],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
