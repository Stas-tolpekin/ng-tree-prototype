import {Observable, Subscription} from "rxjs";

export class ChangeManager {
  private changeSubscription: Subscription | null = null;

  constructor(private readonly checkFn: () => void) {

  }

  destroy(): void {
    this.unsubscribeChange();
  }

  subscribeChange(changed: Observable<void> | undefined): void {
    this.unsubscribeChange();

    if (changed == null) {
      return;
    }

    this.changeSubscription = changed.subscribe(() => this.checkFn());
  }

  private unsubscribeChange(): void {
    if (this.changeSubscription == null) {
      return;
    }

    this.changeSubscription.unsubscribe();
    this.changeSubscription = null;
  }
}