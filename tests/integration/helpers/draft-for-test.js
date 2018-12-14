import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | draft-for', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.drafts = this.owner.lookup('service:drafts');
  });

  test('it returns a draft for the object', async function(assert) {
    this.object = { id: 1 };

    await render(hbs`
      {{#let (draft-for object) as |draft|}}
        <div id="value">
          {{get (value-of draft) "id"}}
        </div>
      {{/let}}
    `);

    assert.dom('#value').hasText('1');
  });

  test('it reacts to a change in the returned draft', async function(assert) {
    this.object = { id: 1 };

    await render(hbs`
      {{#let (draft-for object) as |draft|}}
        <div id="value">
          {{get (value-of draft) "id"}}
        </div>

        <button {{action draft.id.set 2}}>
          Update!
        </button>
      {{/let}}
    `);

    await click('button');

    assert.dom('#value').hasText('2');
  });

  test('it reacts to changed in the draft service', async function(assert) {
    this.object = { id: 1 };

    await render(hbs`
      {{#let (draft-for object) as |draft|}}
        <div id="value">
          {{get (value-of draft) "id"}}
        </div>
      {{/let}}
    `);

    this.drafts.for(this.object).id.set(2);
    await settled();

    assert.dom('#value').hasText('2');
  });
});
