import Controller from '@ember/controller';
import { service } from '@ember-decorators/service';

export default class ApplicationController extends Controller {
  @service drafts;

  object = { value: 1, lastUpdated: new Date() };

  save() {
    const newObject = this.drafts.commit(this.object);

    this.set('object', { ...newObject, lastUpdated: new Date() });
  }

  reset() {
    this.drafts.reset(this.object);
  }
}
