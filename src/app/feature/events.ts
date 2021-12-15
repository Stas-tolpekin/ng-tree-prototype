import {TreeEvent} from "./tree";

export class SettingInGroupChangedEvent implements TreeEvent {
  constructor(
    public readonly uncheckedKeys: string[],
  ) {
  }
}

export class GroupCheckedEvent implements TreeEvent {
  constructor(public readonly checked: boolean) {
  }
}