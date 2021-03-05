import { Component, OnInit, OnDestroy } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { DateTime } from '../../models/datetime';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import { ToastService } from '../../utils/toast/toast.service';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit, OnDestroy {
  timefocus: boolean;
  datefocus: boolean;
  model = new DateTime();
  oldmodel: DateTime;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private net: NetworkService,
    private toast: ToastService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.net.getDateTimeInfo().subscribe((data: DateTime) => {
      this.model = new DateTime(data);
      this.oldmodel = Object.assign({}, data);
    });

    interval(1000)
      .pipe(
        startWith(0),
        takeUntil(this.unsubscribe$),
        switchMap(() => this.net.getDateTime())
      )
      .subscribe((res: DateTime) => {
        if (!this.datefocus) {
          this.model.date = res.date;
        }

        if (!this.timefocus) {
          this.model.time = res.time;
        }
        this.model.lastsync = res.lastsync;
      });

  }
  setNtp(val: MatSlideToggleChange) {
    this.net.setNTP(val.checked).subscribe(() => {

    }, (err) => {
      this.model.ntp = !this.model.ntp;
      this.toast.openSnackBar(err.error, 'Error');
    });
  }
  setTimezone(val: MatSelectChange) {
    this.net.setTimezone(val.value).subscribe(() => {
      this.oldmodel.timezone = this.model.timezone;
    }, (err) => {
      this.model.timezone = this.oldmodel.timezone;
      this.toast.openSnackBar(err.error, 'Error');
    });
  }
  onFocus(val: string) {
    if (val === 'time') {
      this.timefocus = true;
    }
    if (val === 'date') {
      this.datefocus = true;
    }
  }
  onFocusOut() {
    this.timefocus = false;
    this.datefocus = false;
    if (this.model.ntp) {
      return;
    }
    if (this.model.time !== this.oldmodel.time || this.model.date !== this.oldmodel.date) {
      const val = this.model.date + ' ' + this.model.time;
      this.net.setDateTime(val).subscribe(() => {
        this.oldmodel.time = this.model.time;
        this.oldmodel.date = this.model.time;
      }, (err) => {
        this.toast.openSnackBar(err.error, 'Error');
      });
    }
  }
  onChangeServer(event: any) {
    this.net.setntpServer(event.target.value).subscribe(() => {
    }, (err) => {
      this.toast.openSnackBar(err.error, 'Error');
    });
  }
}
