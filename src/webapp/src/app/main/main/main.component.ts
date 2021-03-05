import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NotificationMqttService } from '../../services/notification.mqtt.service';
import { Observable, Subject } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { SystemService } from 'src/app/services/system.service';
import { takeUntil, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IMqttMessage } from 'ngx-mqtt';
import { Result } from 'src/app/models/result';
import { BroadcasterService } from 'src/app/services/broadcaster.service';

type SidebarMenu = 'admin' | 'settings' | 'notifications' | 'other';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  sidebar: SidebarMenu;
  hostname$: Observable<string>;
  @ViewChild('right') right: MatSidenav;
  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;
  results: Map<string, Map<string, Result>>;
  read: boolean;
  condition = false;
  private destroyed = new Subject<any>();


  constructor(
    private service: SystemService,
    private readonly notificationMqtt: NotificationMqttService,
    private router: Router,
    private broadcaster: BroadcasterService
  ) {
    this.hostname$ = this.service.getInfo().pipe(map(info => info.hostname));
    this.results = new Map<string, Map<string, Result>>();
  }

  ngOnInit(): void {
    // this.router.events.pipe(filter((ev: any) =>
    //  ev instanceof NavigationStart)).subscribe(ev => { console.log(ev.url) })

    this.notificationMqtt.topic('#').pipe(takeUntil(this.destroyed))
      .subscribe((data: IMqttMessage) => {
        this.read = false;
        const appLabel = data.topic.substring(data.topic.lastIndexOf('/') + 1);
        const payload = data.payload.toString();
        let msg = {} as Result;
        try {
          msg = JSON.parse(payload);
        } catch (error) {
          msg = { app: appLabel, text: payload };
        }
        let x = this.results.get(appLabel);
        if (x === undefined) {
          x = new Map<string, Result>();
        }
        x.set(msg.ref, msg);
        this.results.set(appLabel, x);
      });
    this.results.clear();
    this.broadcaster.on<boolean>('logs').pipe(takeUntil(this.destroyed)).subscribe((data) => {
      if (data) {
        this.condition = true;
      } else {
        this.condition = false;
      }
    });

  }


  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
  showMenu(sidebar: SidebarMenu) {
    if (this.right.opened && this.sidebar === sidebar) {
      this.right.close();
    } else {
      this.sidebar = sidebar;
      this.right.open();
    }
  }

  closed() {
    this.read = true;
  }

  showApps() {
    this.router.navigateByUrl('main', { skipLocationChange: true }).then(() => {
      this.router.navigate(['main', 'apps']);
    });
  }

  isEmpty() {
    if (this.results != null && this.results !== undefined) {
      if (this.results.size > 0) {
        return false;
      }
    }
    return true;
  }
}
