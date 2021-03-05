import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { SysInfo } from 'src/app/models/sysinfo';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  sysinfo$: Observable<SysInfo>;
  memory$: Observable<string>;
  space$: Observable<string>;
  constructor(
    private service: SystemService,
  ) { }

  ngOnInit(): void {
    this.sysinfo$ = this.service.getInfo().pipe(share());
    this.memory$ = this.sysinfo$.pipe(map(info => this.sizes(info.memTotal, info.memFree)));
    this.space$ = this.sysinfo$.pipe(map(info => this.sizes(info.spaceTotal, info.spaceFree)));
  }

  private sizes = (total: number, free: number) => `Total: ${total} MB, Free: ${free} MB`;
}
