import Service from '@ember/service';
import { from, valueOf } from '@microstates/ember';
import { from as makeObservable, Subject } from 'rxjs';

import MapWithResolver from '../-private/map';

const CURRENT_DRAFT_STORE_KEY = Symbol();
const INITIAL_DRAFT_STORE_KEY = Symbol();
const OBSERVABLE_SUBJECTS_KEY = Symbol();

export default class DraftsService extends Service {
  [CURRENT_DRAFT_STORE_KEY] = new MapWithResolver();
  [INITIAL_DRAFT_STORE_KEY] = new MapWithResolver();
  [OBSERVABLE_SUBJECTS_KEY] = new MapWithResolver();

  _initializeDraft(object, resolver) {
    let nextState;

    const observable = makeObservable(from(object));
    const subject = new Subject();

    subject.subscribe(newState => {
      nextState = newState;

      this[CURRENT_DRAFT_STORE_KEY].set(object, resolver, nextState);
    });

    observable.subscribe(subject);

    this[OBSERVABLE_SUBJECTS_KEY].set(object, resolver, subject);
    this[INITIAL_DRAFT_STORE_KEY].set(object, resolver, nextState);

    return nextState;
  }

  for(object, resolver) {
    let draft;

    if (this[CURRENT_DRAFT_STORE_KEY].has(object, resolver)) {
      draft = this[CURRENT_DRAFT_STORE_KEY].get(object, resolver);
    } else {
      draft = this._initializeDraft(object, resolver);
    }

    return draft;
  }

  isDirty(object, resolver) {
    const draft = this[CURRENT_DRAFT_STORE_KEY].get(object, resolver);

    if (!draft) {
      throw new Error('No draft');
    }

    return this[INITIAL_DRAFT_STORE_KEY].get(object, resolver) !== draft;
  }

  reset(object, resolver) {
    const state = this[INITIAL_DRAFT_STORE_KEY].get(object, resolver);

    this[OBSERVABLE_SUBJECTS_KEY].get(object, resolver).next(state);

    return state;
  }

  commit(object, resolver) {
    const state = this[CURRENT_DRAFT_STORE_KEY].get(object, resolver);

    this[INITIAL_DRAFT_STORE_KEY].set(object, resolver, state);

    return valueOf(state);
  }

  subscribe(object, resolver, callback) {
    // Handle resolver being left out; optional second argument
    if (typeof callback === 'undefined') {
      callback = resolver;
      resolver = undefined;
    }

    if (!this[OBSERVABLE_SUBJECTS_KEY].has(object, resolver)) {
      this.for(object, resolver);
    }

    return this[OBSERVABLE_SUBJECTS_KEY].get(object, resolver).subscribe(
      callback
    );
  }
}
