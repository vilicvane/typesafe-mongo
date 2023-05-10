export function isOperatorOrModifierObject(object: object): boolean {
  return Object.keys(object).every(key => key.startsWith('$'));
}
