import {ChangeNotificator} from "./change-notificator";
import {Group} from "./group";

export class Setting {

  readonly changeNotificator = new ChangeNotificator();
  private _checked: boolean = false;
  private _disabled: boolean = false;
  private _group?: Group;

  constructor(public readonly key: string) {
  }

  get checked(): boolean {
    return this._checked;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    this.changeNotificator.notifyChanged();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get group(): Group {
    if (this._group == null) {
      throw new Error('this._node == null')
    }

    return this._group;
  }

  setGroup(group: Group): void {
    if (this._group != null) {
      throw new Error('Group already set')
    }

    this._group = group;
  }

  setChecked(checked: boolean): void {
    this.setCheckedInner(checked, true);
  }

  handleGroupChecked(checked: boolean): void {
    if (this._disabled) {
      return;
    }

    this.setCheckedInner(checked, false);
  }

  private setCheckedInner(checked: boolean, notifyGroup: boolean): void {
    this._checked = checked;

    this.changeNotificator.notifyChanged();

    if (notifyGroup) {
      this.group.handleSettingChecked(this.key, checked);
    }
  }

}