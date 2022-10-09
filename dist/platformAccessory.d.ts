import { PlatformAccessory } from 'homebridge';
import { RestartHomebridgePlatform } from './platform';
export declare class RestartPlatformAccessory {
    private readonly platform;
    private readonly accessory;
    private restartJob;
    private service;
    doRestart(): void;
    constructor(platform: RestartHomebridgePlatform, accessory: PlatformAccessory);
}
//# sourceMappingURL=platformAccessory.d.ts.map