import {TreeNode} from "./tree";
import {Setting} from "./setting";
import {Group} from "./group";


export function createTree(): TreeNode {

  const root = new TreeNode();
  const group1 = new Group('group1');
  const group1Node = new TreeNode(group1);
  const group2Node = new TreeNode(new Group('group2'));
  root.addChild(group1Node);
  root.addChild(group2Node);

  const sett11 = new Setting('sett11');
  const sett11Node = new TreeNode(sett11);
  const sett12 = new Setting('sett12');
  const sett12Node = new TreeNode(sett12);
  group1Node.addChild(sett11Node);
  group1Node.addChild(sett12Node);

  const group11Node = new TreeNode(new Group('group11'));
  group1Node.addChild(group11Node);

  const sett111 = new Setting('sett111');
  const sett111Node = new TreeNode(sett111);
  const sett112 = new Setting('sett112');
  const sett112Node = new TreeNode(sett112);
  group11Node.addChild(sett111Node);
  group11Node.addChild(sett112Node);

  const sett21Node = new TreeNode(new Setting('sett21'));
  const sett22Node = new TreeNode(new Setting('sett22'));
  group2Node.addChild(sett21Node);
  group2Node.addChild(sett22Node);

  console.log('initialized', root);
  console.log('sett11', sett11);

 // sett11.setChecked(true);
  //sett12.setChecked(true);

  //group1.setChecked(true);

  return root;
}