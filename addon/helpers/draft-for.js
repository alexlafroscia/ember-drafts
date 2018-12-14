import Helper from '@ember/component/helper';
import { service } from '@ember-decorators/service';

export default class DraftFor extends Helper {
  @service drafts;

  subscriber;

  compute([object], { resolver }) {
    this.subscriber = this.drafts.subscribe(object, resolver, () => {
      this.subscriber.unsubscribe();

      this.recompute();
    });

    return this.drafts.for(object, resolver);
  }

  willDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }
}
