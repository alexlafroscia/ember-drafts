import Controller from '@ember/controller';
import { service } from '@ember-decorators/service';
import { valueOf } from '@microstates/ember';

export default class ApplicationController extends Controller {
  @service('drafts') draft;

  history = [];
  object = { value: 1, lastUpdated: new Date() };

  save() {
    const currentState = this.draft
      .for(this.object)
      .lastUpdated.set(new Date());

    // TODO: Why did the `value` disappear??

    // Add to the history
    this.set('history', [...this.history, currentState]);

    const newObject = this.draft.commit(this.object);

    this.set('object', newObject);
  }

  reset() {
    this.draft.reset(this.object);
  }

  revert(previousState) {
    this.set('object', valueOf(previousState));

    this.set('history', [
      ...this.history.slice(0, this.history.indexOf(previousState) + 1)
    ]);
  }
}
