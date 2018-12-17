import BaseDraftHelper from '../-private/base-draft-helper';

export default class DraftFor extends BaseDraftHelper {
  compute([object], { resolver }) {
    super.compute(...arguments);

    return this.drafts.isDirty(object, resolver);
  }
}
