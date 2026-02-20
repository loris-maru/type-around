/**
 * Validates and normalizes hex color input. If valid, calls setter with the normalized value.
 * Adds # prefix if missing, validates format (# + up to 6 hex chars).
 */
export function handleHexChange(
  value: string,
  setter: (v: string) => void
): void {
  let v = value;
  if (!v.startsWith("#")) v = `#${v}`;
  if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setter(v);
}
