export class DateTime {
    ntp?: boolean;
    timezone?: string;
    zones?: [];
    time?: string;
    date?: string;
    ntpserver?: string;
    lastsync?: string;
    constructor(source?: DateTime) {
        if (source) {
            Object.assign(this, source);
        }
    }

}
