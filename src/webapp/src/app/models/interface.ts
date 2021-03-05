export enum NetworkMode {
    Disabled = 1,
    DHCP,
    Static,
    LinkLocalOnly
}
export class Interface {
    id?: number;
    name?: string;
    interfaceType?: string;
    ipv4Mode?: NetworkMode;
    ipv4Address?: string;
    ipv4Gateway?: string;
    ipv4Nameserver?: string;
    ipv6Mode?: NetworkMode;
    ipv6Address?: string;
    ipv6Gateway?: string;
    ipv6Nameserver?: string;
    ipv6LL?: string;
    ipv6ULA?: string;
    mac?: string;
    dnsSuffix?: string;
    hostname?: string;
    constructor(source?: Interface) {
        if (source) {
            Object.assign(this, source);
            if (this.ipv6Mode == null || this.ipv6Mode === undefined) {
                this.ipv6Mode = 3;
            }

        } else {
            this.id = 0;
            this.ipv4Mode = 0;
            this.ipv6Mode = 3;
            this.ipv4Address = '';
            this.ipv6Address = '';
            this.dnsSuffix = '';
            this.mac = '';
        }
    }
}
