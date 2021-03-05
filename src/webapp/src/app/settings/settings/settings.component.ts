import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { DateTime } from '../../models/datetime';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private net: NetworkService, ) { }
  date: string;
  ngOnInit(): void {
    this.net.getDateTime().subscribe((data: DateTime) => {
      this.date = data.date + ' ' + data.time;
    });
  }

}
