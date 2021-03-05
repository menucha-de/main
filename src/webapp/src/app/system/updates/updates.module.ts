import { InstallComponent } from "./install/install.component";
import { RestartComponent } from "./restart/restart.component";
import { Routes, RouterModule } from "@angular/router";
import { UpdatesComponent } from "./updates/updates.component";
import { NgModule } from "@angular/core";
import { UtilsModule } from "../../utils/utils.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';


const routes: Routes = [
  {
    path: '',
    component: UpdatesComponent,
    data: {
      breadcrumb: 'Updates',
      isClickable: true
    },
    children: [
      {
        path: 'install',
        component: InstallComponent,
        data: {
          breadcrumb: 'Install',
        },
      },
      {
        path: 'restart',
        component: RestartComponent,
        data: {
          breadcrumb: 'Restart',
        },
      }, 
    ]
  }
]
@NgModule({
  declarations: [
    UpdatesComponent,
    RestartComponent,
    InstallComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    UtilsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes),

  ]
})
export class UpdatesModule { }