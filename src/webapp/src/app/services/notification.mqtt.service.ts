import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationMqttService {

  private endpoint: string;

  constructor(
    private _mqttService: MqttService,
  ) {
    this.endpoint = 'notification';
  }

  topic(appName: string): Observable<IMqttMessage> {
    const topicName = `${this.endpoint}/${appName}`;
    return this._mqttService.observe(topicName);
  }
}
