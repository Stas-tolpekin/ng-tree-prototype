import {Observable, Subject} from "rxjs";
import {BasicTreeNodeHolder} from "./tree";

export class ChangeNotificator {
  private readonly changeNotificator = new Subject<void>();
  readonly changed: Observable<void> = this.changeNotificator.asObservable();

  notifyChanged(): void {
    this.changeNotificator.next();
  }
}