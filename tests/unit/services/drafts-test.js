import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { valueOf } from '@microstates/ember';
import td from 'testdouble';

let draft;

module('Unit | Service | drafts', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    draft = this.owner.lookup('service:drafts');
  });

  test('it returns the same draft for an object', function(assert) {
    const first = { id: 1 };
    const second = { id: 2 };

    assert.equal(
      draft.for(first),
      draft.for(first),
      'Returned the same draft for the same object'
    );
    assert.notEqual(
      draft.for(first),
      draft.for(second),
      'Returned different drafts for different objects'
    );
  });

  test('telling if an object has changed', function(assert) {
    const object = { id: 1 };
    const d = draft.for(object);

    d.id.set(2);

    assert.ok(
      draft.isDirty(object),
      'The object is recognized as being updated'
    );
  });

  test("resetting an object's draft", function(assert) {
    const listener = td.function();
    const object = { id: 1 };
    const d = draft.for(object);

    d.id.set(2);

    assert.deepEqual(
      valueOf(draft.for(object)),
      { id: 2 },
      'The draft state has been updated'
    );

    draft.subscribe(object, listener);
    const resetState = draft.reset(object);

    assert.deepEqual(
      valueOf(draft.for(object)),
      { id: 1 },
      'The draft state has been reset'
    );

    assert.verify(listener(resetState));
  });

  test('committing the changes to an object', function(assert) {
    const object = { id: 1 };
    const d = draft.for(object);

    d.id.set(2);

    assert.deepEqual(object, { id: 1 }, 'The original object is not changed');

    const updated = draft.commit(object);

    assert.deepEqual(updated, { id: 2 }, 'The updated object is returned');

    draft.reset(object);

    assert.deepEqual(
      valueOf(draft.for(object)),
      { id: 2 },
      'The initial state was updated'
    );
  });

  module('subscribing to changes', function() {
    test('subscribing to updated to a draft', function(assert) {
      const first = td.function();
      const second = td.function();
      const third = td.function();

      const object = { id: 1 };
      const d = draft.for(object);

      draft.subscribe(object, first);
      draft.subscribe(object, second);
      draft.subscribe(object, third);

      const firstDraft = d.id.set(2);

      // Ensure that all subscribers are fired
      assert.verify(first(firstDraft));
      assert.verify(second(firstDraft));
      assert.verify(third(firstDraft));

      const secondDraft = d.id.set(3);

      assert.verify(first(secondDraft));
      assert.verify(second(secondDraft));
      assert.verify(third(secondDraft));
    });

    test('turning off a subscription', function(assert) {
      const listener = td.function();

      const object = { id: 1 };
      const d = draft.for(object);

      const subscriber = draft.subscribe(object, listener);

      const secondDraft = d.id.set(2);
      assert.verify(listener(secondDraft), { times: 1 });

      subscriber.unsubscribe();

      d.id.set(3);

      const { callCount } = td.explain(listener);
      assert.equal(callCount, 1, 'Only called one time');

      assert.deepEqual(
        valueOf(draft.for(object)),
        { id: 3 },
        'The state subscriptionw was not disturbed'
      );
    });
  });
});
