import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BroadcasterService } from 'src/app/services/broadcaster.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<any>();
  constructor(
    private broadcaster: BroadcasterService
  ) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
  onNoClick() {
    this.broadcaster.broadcast('logs', false);
  }
}
