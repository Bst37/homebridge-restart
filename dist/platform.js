"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartHomebridgePlatform = void 0;
const settings_1 = require("./settings");
const platformAccessory_1 = require("./platformAccessory");
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class RestartHomebridgePlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        // this is used to track restored cached accessories
        this.accessories = [];
        this.log.debug('Finished initializing platform:', this.config.name);
        this.api.on('didFinishLaunching', () => {
            this.discoverDevices();
        });
    }
    discoverDevices() {
        const uuid = this.api.hap.uuid.generate('RestartTimer');
        const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
        if (existingAccessory) {
            new platformAccessory_1.RestartPlatformAccessory(this, existingAccessory);
        }
        else {
            const accessory = new this.api.platformAccessory('Restart Timer', uuid);
            accessory.context.config = this.config;
            new platformAccessory_1.RestartPlatformAccessory(this, accessory);
            this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
        }
    }
    configureAccessory(accessory) {
        this.log.info('Loading accessory from cache:', accessory.displayName);
        this.accessories.push(accessory);
    }
}
exports.RestartHomebridgePlatform = RestartHomebridgePlatform;
//# sourceMappingURL=platform.js.map