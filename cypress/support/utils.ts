// https://github.com/sindresorhus/strip-indent
export const stripIndent = (string: string) => {
  // https://github.com/jamiebuilds/min-indent
  const match = string.match(/^[ \t]*(?=\S)/gm)
  const indent =
    match?.reduce<number>(
      (r, a) => Math.min(r, a.length),
      Number.POSITIVE_INFINITY
    ) ?? 0

  return indent
    ? string.replace(new RegExp(`^[ \\t]{${indent}}`, 'gm'), '')
    : string
}

// cypress-fiddle expects a string for the `test` property. This makes authoring
// test code cumbersome however (no syntax highlight, no autocomplete, no auto-
// indentation, etc.). This function serializes the given function and returns
// its body, stripped of unnecessary indentation.
export const serialize = (fn: VoidFunction) => {
  const string = fn.toString()
  const openingBrace = string.indexOf('{')
  const closingBrace = string.lastIndexOf('}')
  const body = string.slice(openingBrace + 1, closingBrace)

  return stripIndent(body)
}
