import { helper } from '@ember/component/helper';

const FORMATTER = Intl.DateTimeFormat('en-us', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
});

export function timeFrom([date] /*, hash*/) {
  return FORMATTER.format(date);
}

export default helper(timeFrom);
