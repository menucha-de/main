import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styleUrls: ['./setting-menu.component.scss']
})
export class SettingMenuComponent implements OnInit {

  @Output() navigated = new EventEmitter<void>();
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  navigate(route: string[]) {
    this.router.navigate(route);
    this.navigated.emit();
  }

}
