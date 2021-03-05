import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BroadcasterService } from 'src/app/services/broadcaster.service';
import { ContainerService } from 'src/app/services/container.service';
@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<any>();
  private loaded = false;
  style$: Observable<Object>;
  constructor(
    private router: Router,
    private service: ContainerService,
    private broadcaster: BroadcasterService
  ) { }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe(event => {
      this.router.navigateByUrl('main', { skipLocationChange: true }).then(() => {
        // this.router.navigate([{ outlets: { primary: ['main', 'apps'] } }]);
        this.router.navigateByUrl(event.url);
      });
    });
    this.style$ = this.broadcaster.on<boolean>('iframe').pipe(
      map(value => {
        if (value) {
          return {'pointer-events': 'none'}
        } else {
          return {}
        }
      })
    )
  }

  load(event: Event, frame: HTMLIFrameElement) {
    const url = new URL(frame.contentWindow.location.href);
    // there are at least two elements
    const currentAppName = url.pathname.split('/')[1];
    if (this.loaded && currentAppName !== 'market') {
      this.router.navigate(['main', 'apps', currentAppName]);
    } else {
      this.service.getAppPage('market/').subscribe();
    }
    this.loaded = true;
  }
}
