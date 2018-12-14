'use strict';

define("dummy/tests/integration/helpers/draft-for-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | draft-for', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);
    hooks.beforeEach(function () {
      this.drafts = this.owner.lookup('service:drafts');
    });
    (0, _qunit.test)('it returns a draft for the object', async function (assert) {
      this.object = {
        id: 1
      };
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "nlNx6M0D",
        "block": "{\"symbols\":[\"draft\"],\"statements\":[[0,\"\\n\"],[4,\"let\",[[27,\"draft-for\",[[23,[\"object\"]]],null]],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[11,\"id\",\"value\"],[9],[0,\"\\n          \"],[1,[27,\"get\",[[27,\"value-of\",[[22,1,[]]],null],\"id\"],null],false],[0,\"\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      assert.dom('#value').hasText('1');
    });
    (0, _qunit.test)('it reacts to a change in the returned draft', async function (assert) {
      this.object = {
        id: 1
      };
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "vDz5WjjB",
        "block": "{\"symbols\":[\"draft\"],\"statements\":[[0,\"\\n\"],[4,\"let\",[[27,\"draft-for\",[[23,[\"object\"]]],null]],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[11,\"id\",\"value\"],[9],[0,\"\\n          \"],[1,[27,\"get\",[[27,\"value-of\",[[22,1,[]]],null],\"id\"],null],false],[0,\"\\n        \"],[10],[0,\"\\n\\n        \"],[7,\"button\"],[9],[0,\"\\n          Update!\\n        \"],[3,\"action\",[[22,0,[]],[22,1,[\"id\",\"set\"]],2]],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      await (0, _testHelpers.click)('button');
      assert.dom('#value').hasText('2');
    });
    (0, _qunit.test)('it reacts to a change in the draft service', async function (assert) {
      this.object = {
        id: 1
      };
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "nlNx6M0D",
        "block": "{\"symbols\":[\"draft\"],\"statements\":[[0,\"\\n\"],[4,\"let\",[[27,\"draft-for\",[[23,[\"object\"]]],null]],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[11,\"id\",\"value\"],[9],[0,\"\\n          \"],[1,[27,\"get\",[[27,\"value-of\",[[22,1,[]]],null],\"id\"],null],false],[0,\"\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      this.drafts.for(this.object).id.set(2);
      await (0, _testHelpers.settled)();
      assert.dom('#value').hasText('2');
    });
    (0, _qunit.test)('it can provide a resolver', async function (assert) {
      this.object = {
        id: 1
      };

      this.resolver = object => object.id;

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Vs91fH19",
        "block": "{\"symbols\":[\"draft\"],\"statements\":[[0,\"\\n\"],[4,\"let\",[[27,\"draft-for\",[[23,[\"object\"]]],[[\"resolver\"],[[23,[\"resolver\"]]]]]],null,{\"statements\":[[0,\"        \"],[7,\"div\"],[11,\"id\",\"value\"],[9],[0,\"\\n          \"],[1,[27,\"get\",[[27,\"value-of\",[[22,1,[]]],null],\"id\"],null],false],[0,\"\\n        \"],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));
      this.drafts.for(this.object, this.resolver).id.set(2);
      await (0, _testHelpers.settled)();
      assert.dom('#value').hasText('2');
    });
  });
});
define("dummy/tests/test-helper", ["dummy/app", "dummy/config/environment", "@ember/test-helpers", "ember-qunit", "ember-cli-testdouble-qunit"], function (_app, _environment, _testHelpers, _emberQunit, _emberCliTestdoubleQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("dummy/tests/unit/services/drafts-test", ["qunit", "ember-qunit", "@microstates/ember", "testdouble"], function (_qunit, _emberQunit, _ember, _testdouble) {
  "use strict";

  let drafts;
  (0, _qunit.module)('Unit | Service | drafts', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    hooks.beforeEach(function () {
      drafts = this.owner.lookup('service:drafts');
    });
    (0, _qunit.module)('#for', function () {
      (0, _qunit.test)('it returns the same draft for an object', function (assert) {
        const first = {
          id: 1
        };
        const second = {
          id: 2
        };
        assert.equal(drafts.for(first), drafts.for(first), 'Returned the same draft for the same object');
        assert.notEqual(drafts.for(first), drafts.for(second), 'Returned different drafts for different objects');
      });
      (0, _qunit.test)('it works with a function resolver', function (assert) {
        const first = {
          id: 1
        };
        const second = {
          id: 1
        };

        const resolver = object => object.id;

        assert.equal(drafts.for(first, resolver), drafts.for(second, resolver), 'Returned the same draft for records that resolve to the same value');
      });
      (0, _qunit.test)('it works with an value resolver', function (assert) {
        const first = {
          id: 1
        };
        const second = {
          id: 1
        };
        const resolver = '1';
        assert.equal(drafts.for(first, resolver), drafts.for(second, resolver), 'Returned the same draft for records with the same resolver value');
      });
    });
    (0, _qunit.module)('#isDirty', function () {
      (0, _qunit.test)('telling if an object has changed', function (assert) {
        const object = {
          id: 1
        };
        const d = drafts.for(object);
        d.id.set(2);
        assert.ok(drafts.isDirty(object), 'The object is recognized as being updated');
      });
    });
    (0, _qunit.module)('#reset', function () {
      (0, _qunit.test)("resetting an object's draft", function (assert) {
        const listener = _testdouble.default.function();

        const object = {
          id: 1
        };
        const d = drafts.for(object);
        d.id.set(2);
        assert.deepEqual((0, _ember.valueOf)(drafts.for(object)), {
          id: 2
        }, 'The draft state has been updated');
        drafts.subscribe(object, listener);
        const resetState = drafts.reset(object);
        assert.deepEqual((0, _ember.valueOf)(drafts.for(object)), {
          id: 1
        }, 'The draft state has been reset');
        assert.verify(listener(resetState));
      });
    });
    (0, _qunit.module)('#commit', function () {
      (0, _qunit.test)('committing the changes to an object', function (assert) {
        const object = {
          id: 1
        };
        const d = drafts.for(object);
        d.id.set(2);
        assert.deepEqual(object, {
          id: 1
        }, 'The original object is not changed');
        const updated = drafts.commit(object);
        assert.deepEqual(updated, {
          id: 2
        }, 'The updated object is returned');
        drafts.reset(object);
        assert.deepEqual((0, _ember.valueOf)(drafts.for(object)), {
          id: 2
        }, 'The initial state was updated');
      });
    });
    (0, _qunit.module)('#subscribe', function () {
      (0, _qunit.test)('subscribing to updated to a draft', function (assert) {
        const first = _testdouble.default.function();

        const second = _testdouble.default.function();

        const third = _testdouble.default.function();

        const object = {
          id: 1
        };
        const d = drafts.for(object);
        drafts.subscribe(object, first);
        drafts.subscribe(object, second);
        drafts.subscribe(object, third);
        const firstDraft = d.id.set(2); // Ensure that all subscribers are fired

        assert.verify(first(firstDraft));
        assert.verify(second(firstDraft));
        assert.verify(third(firstDraft));
        const secondDraft = d.id.set(3);
        assert.verify(first(secondDraft));
        assert.verify(second(secondDraft));
        assert.verify(third(secondDraft));
      });
      (0, _qunit.test)('turning off a subscription', function (assert) {
        const listener = _testdouble.default.function();

        const object = {
          id: 1
        };
        const d = drafts.for(object);
        const subscriber = drafts.subscribe(object, listener);
        const secondDraft = d.id.set(2);
        assert.verify(listener(secondDraft), {
          times: 1
        });
        subscriber.unsubscribe();
        d.id.set(3);

        const {
          callCount
        } = _testdouble.default.explain(listener);

        assert.equal(callCount, 1, 'Only called one time');
        assert.deepEqual((0, _ember.valueOf)(drafts.for(object)), {
          id: 3
        }, 'The state subscriptionw was not disturbed');
      });
      (0, _qunit.test)('providing a resolver', function (assert) {
        const listener = _testdouble.default.function();

        const resolver = object => object.id;

        const object = {
          id: 1
        };
        const d = drafts.for(object, resolver);
        drafts.subscribe({
          id: 1
        }, resolver, listener);
        const newDraft = d.id.set(2);
        assert.verify(listener(newDraft));
      });
    });
  });
});
define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
