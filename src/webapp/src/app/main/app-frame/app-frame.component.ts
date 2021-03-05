import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BroadcasterService } from '../../services/broadcaster.service';

@Component({
  selector: 'app-app-frame',
  templateUrl: './app-frame.component.html',
  styleUrls: ['./app-frame.component.scss']
})
export class AppFrameComponent implements OnInit, OnDestroy {

  destroyed = new Subject<any>();
  src: SafeResourceUrl;
  currentTitle: string;
  currentAppName: string;
  style$: Observable<Object>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private broadcaster: BroadcasterService,
  ) { }

  ngOnInit(): void {
    this.currentAppName = this.route.snapshot.params['type'] + '/';
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentAppName);
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      takeUntil(this.destroyed)
    ).subscribe(event => {
      this.router.navigateByUrl('main', { skipLocationChange: true }).then(() => {
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

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  load(frame: HTMLIFrameElement) {
    this.currentTitle = frame.contentWindow.document.getElementsByTagName('title').item(0)?.innerText;
    this.broadcaster.broadcast('title', this.currentTitle);
  }
}
