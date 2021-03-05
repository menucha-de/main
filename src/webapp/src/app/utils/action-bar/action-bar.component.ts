import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

  constructor() { }
  @Input() link: string;
  @Input() icon: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() selected: boolean;
  @Input() disabled: boolean;
  ngOnInit(): void {

  }

}
