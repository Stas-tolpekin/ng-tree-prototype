import {TreeEvent} from "./tree";

export class SettingInGroupCheckedEvent implements TreeEvent {
  constructor(
    public readonly checked: boolean,
    public readonly settingKey: string,
  ) {
  }
}

export class GroupCheckedEvent implements TreeEvent {
  constructor(public readonly checked: boolean) {
  }
}