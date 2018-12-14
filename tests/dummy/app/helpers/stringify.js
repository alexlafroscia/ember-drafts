import { helper } from '@ember/component/helper';

export function stringify([value]) {
  return JSON.stringify(value);
}

export default helper(stringify);
