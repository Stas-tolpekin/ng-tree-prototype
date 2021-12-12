import {TreeBehaviour, TreeEvent} from "./tree";
import {reduceIterable} from "./iterable-utils";
import {Setting} from "./setting";
import {BehaviourBase} from "./behaviour-base";
import {GroupCheckedEvent, SettingCheckedEvent} from "./events";

export class Group extends BehaviourBase implements TreeBehaviour {

  private _checked: boolean = false;
  private _indeterminate: boolean = false;

  constructor(public readonly key: string) {
    super();
  }

  get checked(): boolean {
    return this._checked;
  }

  get indeterminate(): boolean {
    return this._indeterminate;
  }

  receiveParentEvent(event: TreeEvent): void {
    console.log(this.key, 'group receiveParentEvent', event);
    if (event instanceof SettingCheckedEvent) {
      this.setCheckedInner(event.checked, false, true, false);
      return;
    }

    if (event instanceof GroupCheckedEvent) {
      this.setCheckedInner(event.checked, false, true, false);
      return;
    }

    throw new Error();
  }

  receiveChildrenEvent(event: TreeEvent): void {
    console.log(this.key, 'group receiveChildrenEvent', event);
    if (event instanceof SettingCheckedEvent) {
      this.lookupChildren();
      return;
    }

    if (event instanceof GroupCheckedEvent) {
      this.lookupChildren();
      return;
    }

    throw new Error();
  }

  setChecked(checked: boolean): void {
    this.setCheckedInner(checked, false, true, true);
  }

  private setCheckedInner(
    checked: boolean,
    indeterminate: boolean,
    notifyChildren: boolean,
    notifyParent: boolean
  ): void {
    this._checked = checked;
    this._indeterminate = indeterminate;

    this.notifyChanged();

    if (notifyChildren) {
      this.node.emitEventToChildren(new GroupCheckedEvent(checked));
    }

    if (notifyParent) {
      this.node.emitEventToParent(new GroupCheckedEvent(checked));
    }
  }

  private lookupChildren(): void {
    const checkedCount = this.countCheckedChildren();

    if (checkedCount === 0) {
      this.setCheckedInner(false, false, false, true);
      return;
    }

    if (checkedCount === this.node.children.length) {
      this.setCheckedInner(true, false, false, true);
      return;
    }

    this.setCheckedInner(false, true, false, true);
  }

  private countCheckedChildren(): number {
    return reduceIterable(
      this.node.childrenBehaviours,
      (result, item) => {
        let stateNum: number = 0;

        if (item instanceof Setting) {
          stateNum = getStateNum(item.checked, false);
        }
        if (item instanceof Group) {
          stateNum = getStateNum(item.checked, item.indeterminate);
        }

        return result + stateNum;
      },
      0,
    );
  }


}

function getStateNum(checked: boolean, indeterminate: boolean): number {
  if (!checked && indeterminate) {
    return 0.5;
  }

  return checked ? 1 : 0;
}