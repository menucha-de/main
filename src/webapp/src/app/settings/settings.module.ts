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
import { MatExpansionModule } from '@angular/material/expansion';

import { EthernetComponent } from './ethernet/ethernet.component';
import { NetworkComponent } from './network/network.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UtilsModule } from '../utils/utils.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateTimeComponent } from './date-time/date-time.component';
import { VpnComponent } from './vpn/vpn.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProxyComponent } from './proxy/proxy.component';
const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'datetime',
        component: DateTimeComponent,
        data: {
          breadcrumb: 'Date and Time',
        }
      },    
    ]
  },
  {
    path: 'network',
    component: NetworkComponent,
    data: {
      breadcrumb: 'Network',
      isClickable: true,
    },
    children: [
      {
        path: 'proxy',
        component: ProxyComponent,
        data: {
          breadcrumb: 'Proxy',
        }
      },
      {
        path: 'vpn',
        component: VpnComponent,
        data: {
          breadcrumb: 'VPN',
        }
      },
      {
        path: ':name',
        component: EthernetComponent
      }
    ]
  },
  {
    path: 'bluetooth',
    component: NetworkComponent,
    data: {
      breadcrumb: 'Bluetooth',
    }
  },
  {
    path: 'location',
    component: NetworkComponent,
    data: {
      breadcrumb: 'Location',
    }
  },
  {
    path: 'apps',
    component: NetworkComponent,
    data: {
      breadcrumb: 'Apps',
    }
  },
];

@NgModule({
  declarations: [
    EthernetComponent,
    NetworkComponent,
    DateTimeComponent,
    SettingsComponent,
    VpnComponent,
    ProxyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    UtilsModule,
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
    MatExpansionModule,
    MatProgressSpinnerModule,
  ]
})
export class SettingsModule { }
