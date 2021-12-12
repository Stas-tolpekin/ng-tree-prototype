import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {createTree} from "./feature/create-tree";
import {TreeNode} from "./feature/tree";
import {Setting} from "./feature/setting";

@Component({
  selector: 'app-root',
  template: `
      <router-outlet></router-outlet>

      <li *ngFor="let node of tree.children">
          <app-tree-item [node]="node"></app-tree-item>
      </li>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'tree-test';

  tree: TreeNode;

  constructor() {
    this.tree = createTree();

  }

  ngOnInit(): void {
  }
}


