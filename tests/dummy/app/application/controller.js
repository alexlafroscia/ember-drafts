import Controller from '@ember/controller';
import { service } from '@ember-decorators/service';

export default class ApplicationController extends Controller {
  @service drafts;

  object = { id: 1 };

  commit() {
    const newObject = this.drafts.commit(this.object);

    this.set('object', newObject);
  }

  reset() {
    this.drafts.reset(this.object);
  }
}
