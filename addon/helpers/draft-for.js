import Helper from '@ember/component/helper';
import { service } from '@ember-decorators/service';

export default class DraftFor extends Helper {
  @service drafts;

  compute([object], { resolver }) {
    const subscriber = this.drafts.subscribe(object, resolver, () => {
      subscriber.unsubscribe();

      this.recompute();
    });

    return this.drafts.for(object, resolver);
  }
}
