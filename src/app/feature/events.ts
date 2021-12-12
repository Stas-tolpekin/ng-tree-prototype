import {TreeEvent} from "./tree";

export class SettingCheckedEvent implements TreeEvent {
  static readonly symbol: symbol = Symbol();
  constructor(public readonly checked: boolean) {
  }
}

export class GroupCheckedEvent implements TreeEvent {
  static readonly symbol: symbol = Symbol();
  constructor(public readonly checked: boolean) {
  }
}