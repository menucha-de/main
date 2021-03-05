import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { ToastComponent } from './toast/toast.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    BreadcrumbComponent,
    ActionBarComponent,
    ToastComponent,
    PasswordDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    ActionBarComponent,
    BreadcrumbComponent,
    ToastComponent,
  ],
  entryComponents: [
    ToastComponent
  ]
})
export class UtilsModule { }
