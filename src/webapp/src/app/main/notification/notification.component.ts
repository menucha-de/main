import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { Result } from 'src/app/models/result';
import { BroadcasterService } from 'src/app/services/broadcaster.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, AfterViewInit {
  showLog = false;
  resizing = false;

  @Input() results: Map<string, Map<string, Result>>;
  @Input() show = false;
  @ViewChild('resizerleft') resizerleft: ElementRef<HTMLDivElement>;
  @ViewChild('resizerlog') resizerlog: ElementRef<HTMLDivElement>;
  @ViewChild('notification') notification: ElementRef<HTMLDivElement>;
  @ViewChild('log') log: ElementRef<HTMLDivElement>;

  private move$: Observable<MouseEvent>;
  private up$: Observable<MouseEvent>;
  height$: Observable<number>;
  width$: Observable<number>;
  constructor(private broadcaster: BroadcasterService) {
    this.results = new Map<string, Map<string, Result>>();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.move$ = fromEvent<MouseEvent>(document, 'mousemove');
    this.up$ = fromEvent<MouseEvent>(document, 'mouseup');
    this.width$ = this.resize(this.resizerleft.nativeElement, this.notification.nativeElement, false, () => {
      this.broadcaster.broadcast('iframe', true);
      this.resizing = true;
    }, null, () => {
      this.broadcaster.broadcast('iframe', false);
      this.resizing = false;
    });
    this.height$ = this.resize(this.resizerlog.nativeElement, this.log.nativeElement, true, () => {
      this.resizing = true;
    }, null, () => {
      this.resizing = false;
    });
  }

  resize(
    resizeHandle: HTMLElement,
    targetElement: HTMLElement,
    vertical: boolean,
    downAction: (event: MouseEvent) => void,
    moveAction: (event: MouseEvent) => void,
    upAction: (event: MouseEvent) => void
  ) {
    const down$ = fromEvent<MouseEvent>(resizeHandle, 'mousedown');
    let initSize: number;
    let start: number;
    return down$.pipe(
      tap(downAction),
      tap(event => {
        initSize = vertical ? targetElement.clientHeight : targetElement.clientWidth;
        start = vertical ? event.clientY : event.clientX
      }),
      mergeMap(() => this.move$.pipe(
        tap(moveAction),
        map(event => {
          const offset = start - (vertical ? event.clientY : event.clientX);
          return initSize + offset;
        }),
        takeUntil(this.up$.pipe(
          tap(upAction)
        ))
      ))
    );
  }
  delete(ev: Event, appName: string) {
    ev.stopPropagation();

    if (appName === 'ALL') {
      this.results.clear();
    } else {
      this.results.delete(appName);
    }
  }
  openLogs() {
    this.broadcaster.broadcast('logs', true);
  }

  toggleLog() {
    this.showLog = !this.showLog;
  }

  asIsOrder() {
    return 1;
  }

}
