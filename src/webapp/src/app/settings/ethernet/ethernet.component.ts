import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Interface, NetworkMode } from '../../models/interface';
import { NetworkService } from '../../services/network.service';
import { ToastService } from '../../utils/toast/toast.service';
@Component({
  selector: 'app-ethernet',
  templateUrl: './ethernet.component.html',
  styleUrls: ['./ethernet.component.scss']
})
export class EthernetComponent implements OnInit {
  name: string;
  model = new Interface();
  oldmodel: Interface;
  ipv4: boolean;
  ipv6: boolean;
  modes = NetworkMode;
  modeOptions = [];

  constructor(
    private route: ActivatedRoute,
    private net: NetworkService,
    private toast: ToastService) { }

  ngOnInit(): void {


    this.modeOptions = Object.keys(this.modes).filter(key => isNaN(+key) && key !== 'LinkLocalOnly');
    this.route.params.subscribe(params => {
      this.name = params['name'];
      if (this.name !== '0') {
        this.net.getNetworkInterface(this.name).subscribe((data: Interface) => {
          this.model = new Interface(data);
          this.oldmodel = Object.assign({}, data);
        });
      } else {
        this.model = new Interface();
      }
    });
  }

  get ipv6Address() {
    return this.model.ipv6Mode === NetworkMode.LinkLocalOnly ? this.model.ipv6LL : this.model.ipv6ULA;
  }

  reset() {
    this.model = Object.assign({}, this.oldmodel);
  }
  save() {
    this.net.setNetworkInterface(this.name, this.model).subscribe(() => {
      if (this.name !== '0') {
        this.net.getNetworkInterface(this.name).subscribe((data: Interface) => {
          this.model = new Interface(data);
          this.oldmodel = Object.assign({}, data);
        });
      }
    }, err => {
      this.toast.openSnackBar(err.error, 'Error');
    });
  }
}
