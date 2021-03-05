import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, delay, map, retryWhen, take } from 'rxjs/operators';
import { App } from 'src/app/models/app';
import { ContainerService } from 'src/app/services/container.service';
import { NetworkService } from 'src/app/services/network.service';

export type EnableStatus = 'noConfig' | 'true' | 'false';

@Injectable({
  providedIn: 'root'
})
export class VpnService {
  constructor(
    private http: HttpClient,
    private netService: NetworkService,
    private appService: ContainerService,
  ) { }

  uploadOpenVPNConfig(file: File) {
    return this.http.put('/vpn/rest/default/config', file);
  }

  downloadOpenVPNlog() {
    return this.http.get('/vpn/rest/default/log', { responseType: 'text'});
  }

  isEnabled() {
    return this.http.get<boolean>('/vpn/rest/default/enable').pipe(
      map(value => value ? 'true' as EnableStatus : 'false' as EnableStatus),
      catchError(() => {
        return of('noConfig' as EnableStatus);
      })
    );
  }

  setEnabled(value: boolean): Observable<EnableStatus> {
    return this.http.put('/vpn/rest/default/enable', value).pipe(
      map(() => value.toString() as EnableStatus)
    );
  }

  getVpnAddress(device: string) {
    return this.netService.getNetworkInterface(device).pipe(
      retryWhen(errors => errors.pipe(delay(1000), take(10))),
      map(intf => {
        return intf.ipv4Address;
      })
    );
  }

  reset(app: App) {
    if (app.state === 'STARTED') {
      app.state = 'RESETTINGSTARTED';
    } else {
      app.state = 'RESETTINGSTOPPED';
    }
    return this.appService.updateApp('system', app.name, app);
  }
}
