import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { State } from 'src/app/services/system.service';

@Component({
  selector: 'app-state-dialog',
  templateUrl: './state-dialog.component.html',
  styleUrls: ['./state-dialog.component.scss']
})
export class StateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StateDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  setState(state: State) {
    this.dialogRef.close(state);
  }
}
