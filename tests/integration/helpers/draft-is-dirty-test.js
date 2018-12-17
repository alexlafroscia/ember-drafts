import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | draft-is-dirty', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.drafts = this.owner.lookup('service:drafts');
  });

  test('it returns whether the draft for the object is dirty', async function(assert) {
    this.object = { id: 1 };

    await render(hbs`
      {{#let (draft-is-dirty object) as |value|}}
        <div id="value">
          {{value}}
        </div>
      {{/let}}
    `);

    assert.dom('#value').hasText('false');

    this.drafts.for(this.object).set('id', 2);
    await settled();

    assert.dom('#value').hasText('true');
  });
});
