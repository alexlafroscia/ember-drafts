import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { valueOf } from '@microstates/ember';
import td from 'testdouble';

let drafts;

module('Unit | Service | drafts', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    drafts = this.owner.lookup('service:drafts');
  });

  module('#for', function() {
    test('it returns the same draft for an object', function(assert) {
      const first = { id: 1 };
      const second = { id: 2 };

      assert.equal(
        drafts.for(first),
        drafts.for(first),
        'Returned the same draft for the same object'
      );
      assert.notEqual(
        drafts.for(first),
        drafts.for(second),
        'Returned different drafts for different objects'
      );
    });

    test('it works with a function resolver', function(assert) {
      const first = { id: 1 };
      const second = { id: 1 };
      const resolver = object => object.id;

      assert.equal(
        drafts.for(first, resolver),
        drafts.for(second, resolver),
        'Returned the same draft for records that resolve to the same value'
      );
    });

    test('it works with an value resolver', function(assert) {
      const first = { id: 1 };
      const second = { id: 1 };
      const resolver = '1';

      assert.equal(
        drafts.for(first, resolver),
        drafts.for(second, resolver),
        'Returned the same draft for records with the same resolver value'
      );
    });
  });

  module('#isDirty', function() {
    test('telling if an object has changed', function(assert) {
      const object = { id: 1 };
      const d = drafts.for(object);

      d.id.set(2);

      assert.ok(
        drafts.isDirty(object),
        'The object is recognized as being updated'
      );
    });
  });

  module('#reset', function() {
    test("resetting an object's draft", function(assert) {
      const listener = td.function();
      const object = { id: 1 };
      const d = drafts.for(object);

      d.id.set(2);

      assert.deepEqual(
        valueOf(drafts.for(object)),
        { id: 2 },
        'The draft state has been updated'
      );

      drafts.subscribe(object, listener);
      const resetState = drafts.reset(object);

      assert.deepEqual(
        valueOf(drafts.for(object)),
        { id: 1 },
        'The draft state has been reset'
      );

      assert.verify(listener(resetState));
    });
  });

  module('#commit', function() {
    test('committing the changes to an object', function(assert) {
      const object = { id: 1 };
      const d = drafts.for(object);

      d.id.set(2);

      assert.deepEqual(object, { id: 1 }, 'The original object is not changed');

      const updated = drafts.commit(object);

      assert.deepEqual(updated, { id: 2 }, 'The updated object is returned');

      drafts.reset(object);

      assert.deepEqual(
        valueOf(drafts.for(object)),
        { id: 2 },
        'The initial state was updated'
      );
    });
  });

  module('#subscribe', function() {
    test('subscribing to updated to a draft', function(assert) {
      const first = td.function();
      const second = td.function();
      const third = td.function();

      const object = { id: 1 };
      const d = drafts.for(object);

      drafts.subscribe(object, first);
      drafts.subscribe(object, second);
      drafts.subscribe(object, third);

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
      const d = drafts.for(object);

      const subscriber = drafts.subscribe(object, listener);

      const secondDraft = d.id.set(2);
      assert.verify(listener(secondDraft), { times: 1 });

      subscriber.unsubscribe();

      d.id.set(3);

      const { callCount } = td.explain(listener);
      assert.equal(callCount, 1, 'Only called one time');

      assert.deepEqual(
        valueOf(drafts.for(object)),
        { id: 3 },
        'The state subscriptionw was not disturbed'
      );
    });

    test('providing a resolver', function(assert) {
      const listener = td.function();
      const resolver = object => object.id;

      const object = { id: 1 };
      const d = drafts.for(object, resolver);

      drafts.subscribe({ id: 1 }, resolver, listener);

      const newDraft = d.id.set(2);

      assert.verify(listener(newDraft));
    });
  });
});
