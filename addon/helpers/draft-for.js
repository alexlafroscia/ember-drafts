import Helper from '@ember/component/helper';
import { service } from '@ember-decorators/service';

export default class DraftFor extends Helper {
  @service drafts;

  compute([object]) {
    const subscriber = this.drafts.subscribe(object, () => {
      subscriber.unsubscribe();

      this.recompute();
    });

    return this.drafts.for(object);
  }
}
