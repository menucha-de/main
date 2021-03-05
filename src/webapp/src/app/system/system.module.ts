import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemComponent } from './system/system.component';
import { AboutComponent } from './about/about.component';
import { SupportComponent } from './support/support.component';
import { ResetComponent } from './reset/reset.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UtilsModule } from '../utils/utils.module';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { StateDialogComponent } from './state-dialog/state-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      {
        path: 'about',
        component: AboutComponent,
        data: {
          breadcrumb: 'About',
        },
      },
      {
        path: 'updates',
        loadChildren: () => import('./updates/updates.module').then(m => m.UpdatesModule)
      },
      {
        path: 'reset',
        component: ResetComponent,
        data: {
          breadcrumb: 'Reset',
        },
      },
      {
        path: 'support',
        component: SupportComponent,
        data: {
          breadcrumb: 'Support',
        },
      },
    ]
  },

];

@NgModule({
  declarations: [
    SystemComponent,
    AboutComponent,
    SupportComponent,
    ResetComponent,
    StateDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule,
    UtilsModule,
  ]
})
export class SystemModule { }
