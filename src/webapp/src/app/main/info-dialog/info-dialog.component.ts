import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { SysInfo } from 'src/app/models/sysinfo';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {

  sysinfo$: Observable<SysInfo>;
  sysinfo: SysInfo;
  json: SafeUrl;
  @ViewChild('downloadEl') downloadEl: ElementRef<HTMLAnchorElement>;
  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) private data: { info: SysInfo }
  ) { }

  ngOnInit(): void {
    this.sysinfo = this.data.info;
    const theJSON = JSON.stringify(this.sysinfo, null, 2);
    this.json = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
  }

  download() {
    this.downloadEl.nativeElement.click();
  }
}
