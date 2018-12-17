import Controller from '@ember/controller';
import { service } from '@ember-decorators/service';
import { valueOf } from '@microstates/ember';

export default class ApplicationController extends Controller {
  @service drafts;

  history = [];
  object = { value: 1, lastUpdated: new Date() };

  save() {
    // Add to the history
    const currentState = this.drafts.for(this.object);
    this.set('history', [...this.history, currentState]);

    const newObject = this.drafts.commit(this.object);

    this.set('object', { ...newObject, lastUpdated: new Date() });
  }

  reset() {
    this.drafts.reset(this.object);
  }

  revert(previousState) {
    this.set('object', valueOf(previousState));

    this.set('history', [
      ...this.history.slice(0, this.history.indexOf(previousState) + 1)
    ]);
  }
}
