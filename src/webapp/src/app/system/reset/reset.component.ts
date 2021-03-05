import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SystemService, State } from 'src/app/services/system.service';
import { StateDialogComponent } from '../state-dialog/state-dialog.component';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  constructor(
    private system: SystemService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }


  setState() {
    const dialogRef = this.dialog.open<StateDialogComponent, any, State>(StateDialogComponent, {
      width: '260px',
    });
    dialogRef.afterClosed().pipe(switchMap(state => {
      if (state != null) {
        return this.system.setState(state);
      }
      return of(false);
    })).subscribe();
  }
}
