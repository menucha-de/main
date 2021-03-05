import { Component, OnInit } from '@angular/core';
import { ContainerService } from '../../../services/container.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemService } from 'src/app/services/system.service';
import { Observable } from 'rxjs';
import { SysInfo } from 'src/app/models/sysinfo';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from 'src/app/utils/password-dialog/password-dialog.component';
import { App } from 'src/app/models/app';
import { Credentials } from 'src/app/models/credentials';
import { NotificationMqttService } from 'src/app/services/notification.mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit {
  isVisible: boolean;
  sysinfo$: Observable<SysInfo>;
  updates: App[];
  credentials: Credentials;
  actionBarIcon: string;
  actionBarTitle: string;
  actionBarSubtitle: string;
  actionBarEnabled: boolean;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private cservice: ContainerService,
    private sysinfo: SystemService,
    private readonly notificationMqtt: NotificationMqttService,
    private ddialog: MatDialog) { }

  ngOnInit(): void {
    this.sysinfo$ = this.sysinfo.getInfo();
    this.actionBarIcon = 'autorenew';
    this.actionBarTitle = 'Check for updates';
    this.actionBarSubtitle = 'Check if a new version is available';
    this.actionBarEnabled = true;
  }

  checkUpdates() {
    const dialog = new MatDialogConfig();
    dialog.autoFocus = true;
    dialog.data = {};
    const dialogRef = this.ddialog.open(PasswordDialogComponent, dialog);

    dialogRef.afterClosed().subscribe(
      creds => {
        // dialog closed with 'OK'
        if (creds != null) {

          let msg = {} as Result;
          this.notificationMqtt.topic('Runtime')
            .subscribe((data: IMqttMessage) => {
              const appLabel = data.topic.substring(data.topic.lastIndexOf('/') + 1);
              const payload = data.payload.toString();
              try {
                msg = JSON.parse(payload);
              } catch (error) {
                msg = { app: appLabel, text: payload };
              }
            });

          let updateFailed = {} as Result;
          this.notificationMqtt.topic('#')
            .subscribe((data: IMqttMessage) => {
              const appLabel = data.topic.substring(data.topic.lastIndexOf('/') + 1);
              const payload = data.payload.toString();
              try {
                updateFailed = JSON.parse(payload);
              } catch (error) {
                updateFailed = { app: appLabel, text: payload };
              }
            });

          this.credentials = creds;
          this.actionBarTitle = 'Checking for updates ...';
          this.actionBarSubtitle = 'Please wait ...';
          this.actionBarEnabled = false;

          //check for updates and if found navigate
          this.cservice.getUpdates(creds).subscribe((updates) => {
            if (!(msg && msg.status === 'FAILURE')) {
              if (updates != null && updates.length > 0) {
                this.updates = updates;
                this.router.navigate(['install'], { relativeTo: this.route });
                this.actionBarIcon = 'autorenew';
                this.actionBarTitle = 'Check for updates';
                this.actionBarSubtitle = 'Check if a new version is available';
                this.actionBarEnabled = true;
              } else {
                if (!(updateFailed && updateFailed.status === 'FAILURE' && updateFailed.text.includes('Failed to check for updates'))) {
                  this.actionBarIcon = 'done';
                  this.actionBarTitle = 'System is up to date';
                  this.actionBarSubtitle = undefined;
                  this.actionBarEnabled = false;
                } else {
                  this.actionBarIcon = 'autorenew';
                  this.actionBarTitle = 'Check for updates';
                  this.actionBarSubtitle = 'Check if a new version is available';
                  this.actionBarEnabled = true;
                  }
              }
            }
          });
        }
      });
  };
}