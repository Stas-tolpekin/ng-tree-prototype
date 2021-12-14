import {TreeNode} from "./tree";
import {Setting} from "./setting";
import {Group} from "./group";


export function createTree(): TreeNode {

  const root = new TreeNode();
  const group1 = new Group('group1', [
    new Setting('sett1'),
    new Setting('sett2')
  ]);
  const group1Node = new TreeNode(group1);
  const group2Node = new TreeNode(new Group('group2', [
    new Setting('sett1'),
    new Setting('sett2')
  ]));
  root.addChild(group1Node);
  root.addChild(group2Node);


  const group11Node = new TreeNode(new Group('group11', [
    new Setting('sett1'),
    new Setting('sett2')
  ]));
  group1Node.addChild(group11Node);

  console.log('initialized', root);

  // sett11.setChecked(true);
  //sett12.setChecked(true);

  //group1.setChecked(true);

  return root;
}