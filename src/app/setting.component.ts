import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy} from "@angular/core";
import {Setting} from "./feature/setting";
import {ChangeManager} from "./change-manager";

@Component({
  selector: 'app-setting',
  template: `<span *ngIf="setting">setting {{setting.key}} - <input type="checkbox" (change)="changeChecked($event)"
                                                                    [checked]="setting.checked"
                                                                    [disabled]="setting.disabled"/>
  d:{{setting.disabled}} | c:{{setting.checked}}
  </span>
  
  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingComponent implements OnDestroy {
  private _setting: Setting | null = null;

  private readonly changeManager: ChangeManager;

  constructor(
    private readonly chDetRef: ChangeDetectorRef,
  ) {
    this.changeManager = new ChangeManager(() => chDetRef.markForCheck())
  }

  get setting(): Setting | null {
    return this._setting;
  }

  @Input()
  set setting(value: Setting | null) {
    this._setting = value;
    this.changeManager.subscribeChange(value?.changeNotificator.changed);
  }

  ngOnDestroy(): void {
    this.changeManager.destroy();
  }

  changeChecked(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.setting?.setChecked(input.checked);
  }
}
