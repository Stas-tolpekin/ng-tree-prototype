import {BasicTreeNodeHolder, TreeBehaviour, TreeEvent} from "./tree";
import {reduceIterable} from "./iterable-utils";
import {Setting} from "./setting";
import {GroupCheckedEvent, SettingInGroupChangedEvent} from "./events";
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
    this.lookupChildren(true);
  }

  receiveParentEvent(event: TreeEvent): void {
    if (event instanceof GroupCheckedEvent) {
      this.setAllSettingsChecked(event.checked);
      this.setCheckedInner(event.checked, false, true, false);
      return;
    }

    if (event instanceof SettingInGroupChangedEvent){
      this.setSettingsDisabledState(event.uncheckedKeys);
      this.node.emitEventToChildren(event);
      return;
    }

    throw new Error();
  }

  receiveChildrenEvent(event: TreeEvent): void {
    if (event instanceof GroupCheckedEvent) {
      this.lookupChildren(false);
      return;
    }

    throw new Error();
  }

  setChecked(checked: boolean): void {
    this.setAllSettingsChecked(checked);
    this.lookupChildren(true);
    this.setCheckedInner(checked, false, true, true);
  }

  private setSettingsDisabledState(uncheckedKeys: string[]): void {
    for (const setting of this._settings){
      setting.disabled = uncheckedKeys.includes(setting.key);
    }
  }

  private setAllSettingsChecked(checked: boolean): void {
    this._settings.forEach(item => {
      if (item.checked !== checked){
        item.handleGroupChecked(checked);
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

  private lookupChildren(notifyChildrenAboutSettingsState: boolean): void {
    const [checkedCount, uncheckedSettingKeys] = this.countCheckedItems();
    const totalCount = this.node.children.length + this.settings.length;
    console.log('lookupChildren', checkedCount, totalCount, uncheckedSettingKeys);

    if (notifyChildrenAboutSettingsState) {
      this.node.emitEventToChildren(new SettingInGroupChangedEvent(uncheckedSettingKeys));
    }

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

  private countCheckedItems(): [number, string[]] {
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

    let checkedSettingsCount: number = 0;
    const uncheckedSettingKeys: string[] = [];

    for (const setting of this._settings){
      checkedSettingsCount += (setting.checked ? 1 : 0);
      if (!setting.checked){
        uncheckedSettingKeys.push(setting.key);
      }
    }

    return [checkedGroups + checkedSettingsCount, uncheckedSettingKeys];
  }


}

function getStateNum(checked: boolean, indeterminate: boolean): number {
  if (!checked && indeterminate) {
    return 0.5;
  }

  return checked ? 1 : 0;
}