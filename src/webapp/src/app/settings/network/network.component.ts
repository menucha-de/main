import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { Interface } from '../../models/interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VpnService } from '../vpn/vpn.service';
import { BroadcasterService } from 'src/app/services/broadcaster.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  ethernet = '0';
  ethernetSubtitle = 'Not connected';
  ethName: string;
  selectedLink = '';

  proxySub$: Observable<string>;
  vpnSub$: Observable<string>;
  constructor(
    private net: NetworkService,
    private vpn: VpnService,
    private broadcaster: BroadcasterService,
  ) { }

  ngOnInit(): void {
    this.vpnSub$ = this.broadcaster.on<string>('vpn');
    this.proxySub$ = this.broadcaster.on<string>('proxy');
    this.net.getProxyConfig().subscribe(val => {
      const configured = val.httpProxy.length > 0 || val.httpProxy.length > 0 || val.noProxy.length > 0;
      const result = configured ? 'Configured' : 'Not configured'
      this.broadcaster.broadcast('proxy', result);
    });
    this.vpn.isEnabled().subscribe(status => {
      switch (status) {
        case 'false':
          this.broadcaster.broadcast('vpn', 'Disabled');
          break;
        case 'true':
          this.broadcaster.broadcast('vpn', 'Enabled');
          break;
        case 'noConfig':
          this.broadcaster.broadcast('vpn', 'Not configured');
          break;
        default:
          break;
      }
    });
    this.net.getNetworkDetails().subscribe((data: Interface[]) => {
      for (const val of data) {
        if (val.interfaceType === 'ether') {
          this.ethernet = val.name;
          this.ethernetSubtitle = 'Connected';
          this.ethName = val.name;
        }
        if (val.name.startsWith('tun')) {

        }
      }
    });
  }

  onSelect(val: string) {
    this.selectedLink = val;
  }
}
