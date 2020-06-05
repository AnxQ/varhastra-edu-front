import Vue, { PluginFunction } from "vue";

export class Snack {
  loading: boolean = false;
  hasInfo: boolean = false;
  infoText: string = "";
  showInfo(msg: Error) {
    this.infoText = msg.message;
    this.hasInfo = true;
    this.loading = false;
  }
}

export default new Snack();
