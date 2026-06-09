export function requireParam(value: string | undefined, label: string) {
  if (!value) {
    throw new Error(`Parameter ${label} wajib diisi.`);
  }

  return value;
}
