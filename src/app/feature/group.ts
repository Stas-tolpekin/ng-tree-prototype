import {BasicTreeNodeHolder, TreeBehaviour, TreeEvent} from "./tree";
import {reduceIterable} from "./iterable-utils";
import {Setting} from "./setting";
import {GroupCheckedEvent, SettingInGroupCheckedEvent} from "./events";
import {ChangeNotificator} from "./change-notificator";

export class Group extends BasicTreeNodeHolder implements TreeBehaviour {

  readonly changeNotificator = new ChangeNotificator();
  private _checked: boolean = false;
  private _indeterminate: boolean = false;
  private readonly _settings: Setting[];

  constructor(public readonly key: string, settings: Setting[]) {
    super();

    this._settings = settings;
    this._settings.forEach(item => item.setGroup(this));
  }

  get checked(): boolean {
    return this._checked;
  }

  get indeterminate(): boolean {
    return this._indeterminate;
  }

  get settings(): ReadonlyArray<Setting> {
    return this._settings;
  }

  handleSettingChecked(key: string, checked: boolean): void {
    console.log(this.key, 'handleSettingChecked', key, checked);
    this.lookupChildren();
  }

  receiveParentEvent(event: TreeEvent): void {
    console.log(this.key, 'group receiveParentEvent', event);

    if (event instanceof GroupCheckedEvent) {
      this.setAllSettingsChecked(event.checked);
      this.setCheckedInner(event.checked, false, true, false);
      return;
    }

    if (event instanceof SettingInGroupCheckedEvent){

    }

    throw new Error();
  }

  receiveChildrenEvent(event: TreeEvent): void {
    console.log(this.key, 'group receiveChildrenEvent', event);

    if (event instanceof GroupCheckedEvent) {
      this.lookupChildren();
      return;
    }

    throw new Error();
  }

  setChecked(checked: boolean): void {
    this.setAllSettingsChecked(checked);
    this.setCheckedInner(checked, false, true, true);
  }

  private setAllSettingsChecked(checked: boolean): void {
    this._settings.forEach(item => {
      if (item.checked !== checked){
        item.handleGroupChecked(checked);
        this.node.emitEventToChildren(new SettingInGroupCheckedEvent(checked, item.key))
      }
    });
  }

  private setCheckedInner(
    checked: boolean,
    indeterminate: boolean,
    notifyChildren: boolean,
    notifyParent: boolean
  ): void {
    this._checked = checked;
    this._indeterminate = indeterminate;

    this.changeNotificator.notifyChanged();

    if (notifyChildren) {
      this.node.emitEventToChildren(new GroupCheckedEvent(checked));
    }

    if (notifyParent) {
      this.node.emitEventToParent(new GroupCheckedEvent(checked));
    }
  }

  private lookupChildren(): void {
    const checkedCount = this.countCheckedItems();
    const totalCount = this.node.children.length + this.settings.length;
    console.log('lookupChildren', checkedCount, totalCount)

    if (checkedCount === 0) {
      this.setCheckedInner(false, false, false, true);
      return;
    }

    if (checkedCount === totalCount) {
      this.setCheckedInner(true, false, false, true);
      return;
    }

    this.setCheckedInner(false, true, false, true);
  }

  private countCheckedItems(): number {
    const checkedGroups: number = reduceIterable(
      this.node.childrenBehaviours,
      (result, item) => {
        let stateNum: number = 0;

        if (item instanceof Group) {
          stateNum = getStateNum(item.checked, item.indeterminate);
        }

        return result + stateNum;
      },
      0,
    )

    const checkedSettings: number = this._settings.reduce(
      (count, item) =>
        count + (item.checked ? 1 : 0),
      0,
    )

    return checkedGroups + checkedSettings;
  }


}

function getStateNum(checked: boolean, indeterminate: boolean): number {
  if (!checked && indeterminate) {
    return 0.5;
  }

  return checked ? 1 : 0;
}