import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Proxy } from 'src/app/models/proxy';
import { BroadcasterService } from 'src/app/services/broadcaster.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss']
})
export class ProxyComponent implements OnInit {

  form: FormGroup;
  constructor(
    private netService: NetworkService,
    private fb: FormBuilder,
    private broadcaster: BroadcasterService,
  ) { }

  proxyConfig$: Observable<Proxy>;
  ngOnInit(): void {
    this.form = this.fb.group({
      httpProxy: [''],
      httpsProxy: [''],
      noProxy: ['']
    })

    this.loadProxySettings();
  }

  private loadProxySettings() {
    this.proxyConfig$ = this.netService.getProxyConfig().pipe(
      tap(val => {
        this.form.patchValue(val);
      })
    );
  }

  save(value: Proxy) {
    this.netService.setProxyConfig(value).subscribe(() => {
      const configured = value.httpProxy.length > 0 || value.httpProxy.length > 0 || value.noProxy.length > 0;
      const result = configured ? 'Configured' : 'Not configured'
      this.broadcaster.broadcast('proxy', result);
    });
  }

  reset() {
    this.loadProxySettings();
  }
}
