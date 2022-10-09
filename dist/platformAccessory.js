"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartPlatformAccessory = void 0;
const croner_1 = __importDefault(require("croner"));
const child_process = __importStar(require("child_process"));
class RestartPlatformAccessory {
    constructor(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
            .setCharacteristic(this.platform.Characteristic.Model, 'Restart Timer')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial')
            .setCharacteristic(this.platform.Characteristic.Active, true);
        this.service = this.accessory.getService('Restart Timer') ||
            this.accessory.addService(this.platform.Service.PowerManagement, 'Restart Timer', 'RestartTimer');
        this.service.setCharacteristic(this.platform.Characteristic.Name, 'Restart at ' + this.platform.config.cron.replaceAll(' ', ' '));
        this.platform.log.info('Sheduling restart at ' + this.platform.config.cron);
        this.restartJob = new croner_1.default(this.platform.config.cron.replaceAll(' ', ' '), () => { this.doRestart(); });
    }
    doRestart() {
        this.platform.log.warn('Restarting at one second');
        const cmd = 'sudo kill 1';
        this.service.setCharacteristic(this.platform.Characteristic.Name, 'Restarting');
        setTimeout(() => {
            child_process.exec(cmd);
        }, 1000);
    }
}
exports.RestartPlatformAccessory = RestartPlatformAccessory;
//# sourceMappingURL=platformAccessory.js.map