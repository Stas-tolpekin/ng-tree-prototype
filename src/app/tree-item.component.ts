import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {TreeNode} from "./feature/tree";
import {Group} from "./feature/group";
import {Setting} from "./feature/setting";

@Component({
  selector: 'app-tree-item',
  template: `
      <ng-container [ngSwitch]="nodeType">
          <app-group *ngSwitchCase="nodeTypeEnum.Group" [group]="group"></app-group>
      </ng-container>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeItemComponent {
  readonly nodeTypeEnum = NodeType;

  @Input()
  node?: TreeNode;

  get nodeType(): NodeType {
    if (this.node == null) {
      return NodeType.None;
    }

    return this.node.behaviour instanceof Group ? NodeType.Group : NodeType.Setting;
  }

  get group(): Group {
    return this.node?.behaviour as Group;
  }
}

enum NodeType {
  None,
  Setting,
  Group
}