export function isOperatorObject(object: object): boolean {
  return Object.keys(object).every(key => key.startsWith('$'));
}
