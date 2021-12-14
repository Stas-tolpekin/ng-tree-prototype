import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy} from "@angular/core";
import {Group} from "./feature/group";
import {TreeNode} from "./feature/tree";
import {ChangeManager} from "./change-manager";
import {Setting} from "./feature/setting";

@Component({
  selector: 'app-group',
  template: `
      <span *ngIf="group">group {{group.key}}
          <input type="checkbox"
                 (change)="changeChecked($event)"
                 [checked]="group.checked"
                 [indeterminate]="group.indeterminate"/>
          <button (click)="expand = !expand">expand/collapse</button>
      </span>
      <ul *ngIf="expand">
          <li *ngFor="let item of settings">
              <app-setting [setting]="item"></app-setting>
          </li>
          
          <li *ngFor="let node of children">
              <app-tree-item [node]="node"></app-tree-item>
          </li>
      </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent implements OnDestroy {
  expand: boolean = false;

  private _group: Group | null = null;

  private readonly changeManager: ChangeManager;

  constructor(
    private readonly chDetRef: ChangeDetectorRef,
  ) {
    this.changeManager = new ChangeManager(() => chDetRef.markForCheck())
  }

  get group(): Group | null {
    return this._group;
  }

  @Input()
  set group(value: Group | null) {
    this._group = value;
    this.changeManager.subscribeChange(value?.changeNotificator.changed);
  }

  get children(): ReadonlyArray<TreeNode> {
    return this._group?.node.children ?? [];
  }

  get settings(): ReadonlyArray<Setting> {
    return this._group?.settings ?? [];
  }

  ngOnDestroy(): void {
    this.changeManager.destroy();
  }

  changeChecked(e: Event): void {
    const input = e.target as HTMLInputElement;
    this._group?.setChecked(input.checked);
  }
}