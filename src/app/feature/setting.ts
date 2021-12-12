import {TreeBehaviour, TreeEvent} from "./tree";
import {BehaviourBase} from "./behaviour-base";
import {GroupCheckedEvent, SettingCheckedEvent} from "./events";

export class Setting extends BehaviourBase implements TreeBehaviour {

  private _checked: boolean = false;

  constructor(public readonly key: string) {
    super();
  }

  get checked(): boolean {
    return this._checked;
  }

  receiveParentEvent(event: TreeEvent): void {
    console.log(this.key, 'setting receiveEvent', event);
    if (event instanceof GroupCheckedEvent) {
      this.setCheckedInner(event.checked, false);
      return;
    }

    throw new Error();
  }

  receiveChildrenEvent(event: TreeEvent): void {

    throw new Error();
  }

  setChecked(checked: boolean): void {
    this.setCheckedInner(checked, true);
  }

  private setCheckedInner(checked: boolean, notifyParent: boolean): void {
    this._checked = checked;

    this.notifyChanged();

    if (notifyParent) {
      this.node.emitEventToParent(new SettingCheckedEvent(checked));
    }
  }

}