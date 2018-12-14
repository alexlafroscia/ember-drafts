import Service from '@ember/service';
import { from, valueOf } from '@microstates/ember';
import { from as makeObservable, Subject } from 'rxjs';

let CURRENT_DRAFT_STORE = new WeakMap();
let INITIAL_DRAFT_STORE = new WeakMap();

let OBSERVABLE_SUBJECTS = new WeakMap();

export default class DraftsService extends Service {
  _initializeDraft(object) {
    let nextState;

    const observable = makeObservable(from(object));
    const subject = new Subject();

    subject.subscribe(newState => {
      nextState = newState;

      CURRENT_DRAFT_STORE.set(object, nextState);
    });

    observable.subscribe(subject);

    OBSERVABLE_SUBJECTS.set(object, subject);
    INITIAL_DRAFT_STORE.set(object, nextState);

    return nextState;
  }

  for(object) {
    let draft;

    if (CURRENT_DRAFT_STORE.has(object)) {
      draft = CURRENT_DRAFT_STORE.get(object);
    } else {
      draft = this._initializeDraft(object);
    }

    return draft;
  }

  isDirty(object) {
    const draft = CURRENT_DRAFT_STORE.get(object);

    if (!draft) {
      throw new Error('No draft');
    }

    return INITIAL_DRAFT_STORE.get(object) !== draft;
  }

  reset(object) {
    const state = INITIAL_DRAFT_STORE.get(object);

    OBSERVABLE_SUBJECTS.get(object).next(state);

    return state;
  }

  commit(object) {
    const state = CURRENT_DRAFT_STORE.get(object);

    INITIAL_DRAFT_STORE.set(object, state);

    return valueOf(state);
  }

  subscribe(object, callback) {
    if (!OBSERVABLE_SUBJECTS.has(object)) {
      this.for(object);
    }

    return OBSERVABLE_SUBJECTS.get(object).subscribe(callback);
  }
}
