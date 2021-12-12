import {Observable, Subject} from "rxjs";
import {BasicTreeNodeHolder} from "./tree";

export abstract class BehaviourBase extends BasicTreeNodeHolder {
  private readonly changeNotificator = new Subject<void>();
  readonly changed: Observable<void> = this.changeNotificator.asObservable();

  protected notifyChanged(): void {
    this.changeNotificator.next();
  }
}

