import { Service, PlatformAccessory } from 'homebridge';
import { RestartHomebridgePlatform } from './platform';
import Cron from 'croner';
import * as child_process from 'child_process';


export class RestartPlatformAccessory {
  private restartJob: Cron;
  private service: Service;

  doRestart() {
    this.platform.log.warn('Restarting at one second');
    const cmd = 'sudo kill 1';
    this.service.setCharacteristic(this.platform.Characteristic.Name, 'Restarting');
    setTimeout(() => {
      child_process.exec(cmd);
    }, 1000);
  }

  constructor(
    private readonly platform: RestartHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Restart Timer')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial')
      .setCharacteristic(this.platform.Characteristic.Active, true);

    this.service = this.accessory.getService('Restart Timer') ||
      this.accessory.addService(this.platform.Service.PowerManagement, 'Restart Timer', 'RestartTimer');
    this.service.setCharacteristic(this.platform.Characteristic.Name, 'Restart at ' + this.platform.config.cron.replaceAll(/\s+/g, ' '));

    this.platform.log.info('Sheduling restart at ' + this.platform.config.cron);
    if (this.platform.config.cron) {
      this.restartJob = new Cron(this.platform.config.cron.replaceAll(/\s+/g, ' '), () => {
        this.doRestart();
      });
    }
  }
}
