export class TreeNode {
  private _parent: TreeNode | null = null;
  private _children: TreeNode[] = [];
  private readonly _behaviour: TreeBehaviour;

  constructor(behaviour?: TreeBehaviour) {
    this._behaviour = behaviour ?? new EmptyTreeBehaviour();
    this._behaviour.setNode(this);
  }

  get parent(): TreeNode | null {
    return this._parent;
  }

  get children(): ReadonlyArray<TreeNode> {
    return this._children;
  }

  get behaviour(): TreeBehaviour {
    return this._behaviour;
  }

  get childrenBehaviours(): Generator<TreeBehaviour> {
    return this.iterateChildrenBehaviours();
  }

  addChild(node: TreeNode): void {
    if (node.parent != null) {
      throw new Error('parent is not null');
    }
    this._children.push(node);
    node.setParent(this);
  }

  removeChild(node: TreeNode): void {
    const index = this._children.indexOf(node);
    if (index < 0) {
      return;
    }
    this._children.splice(index, 1);
    node.setParent(null);
  }

  clear(): void {
    this._children.forEach((node: TreeNode) => node.setParent(null));
    this._children = [];
  }

  emitEventToParent(event: TreeEvent): void {
    this._parent?._behaviour.receiveChildrenEvent(event);
    console.log('emitEventToParent', event, this, this._parent);
  }

  emitEventToChildren(event: TreeEvent): void {
    this._children.forEach(node => {
      node._behaviour.receiveParentEvent(event);
      console.log('emitEventToChildren', event, this, node);
    });
  }

  private setParent(node: TreeNode | null): void {
    this._parent = node;
  }

  private* iterateChildrenBehaviours(): Generator<TreeBehaviour> {
    for (const node of this._children) {
      yield node._behaviour;
    }
  }
}

export interface TreeEvent {
}

export interface TreeNodeHolder {
  setNode(node: TreeNode): void;
}

export interface TreeBehaviour extends TreeNodeHolder {
  receiveParentEvent(event: TreeEvent): void;
  receiveChildrenEvent(event: TreeEvent): void;
}

export class EmptyTreeBehaviour implements TreeBehaviour {
  setNode(node: TreeNode): void {
  }

  receiveParentEvent(event: TreeEvent): void {
  }

  receiveChildrenEvent(event: TreeEvent): void {
  }
}

export class BasicTreeNodeHolder implements TreeNodeHolder {
  private _node?: TreeNode;


  get node(): TreeNode {
    if (this._node == null) {
      throw new Error('this._node == null')
    }

    return this._node;
  }

  setNode(node: TreeNode): void {
    this._node = node;
  }
}

