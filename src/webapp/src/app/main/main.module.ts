import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
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
import { AdminComponent } from './admin/admin.component';
import { AppsComponent } from './apps/apps.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SettingMenuComponent } from './setting-menu/setting-menu.component';
import { AppFrameComponent } from './app-frame/app-frame.component';
import { UtilsModule } from '../utils/utils.module';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationComponent } from './notification/notification.component';
import { LogsComponent } from './logs/logs.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
const routes: Routes = [
  {
    path: '', redirectTo: 'main/apps', pathMatch: 'full',
    data: {
      breadcrumb: 'center',
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login/change',
    component: ChangePasswordComponent,
    data: {
      breadcrumb: 'Apps',
    }
  },
  {
    path: 'main', component: MainComponent, canActivate: [AuthGuardService],
    children: [
      {
        path: 'apps',
        component: AppsComponent,
      },
      {
        path: 'apps/:type',
        component: AppFrameComponent,
        data: {
          breadcrumb: '',
        },
      },
      {
        path: 'system',
        data: {
          breadcrumb: 'System',
        },
        loadChildren: () => import('../system/system.module').then(m => m.SystemModule)
      },
      {
        path: 'settings',
        data: {
          breadcrumb: 'Settings',
        },
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
    ]
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    AppsComponent,
    ChangePasswordComponent,
    LoginComponent,
    MainComponent,
    SettingMenuComponent,
    AppFrameComponent,
    NotificationComponent,
    LogsComponent,
    InfoDialogComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
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
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
  ]
})
export class MainModule { }
