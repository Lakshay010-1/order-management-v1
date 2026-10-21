export function validateStrEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error("Missing required environment variables: " + name);
  }
  return value;
}

export function validateNumEnv(name: string): number {
  const value = Number(validateStrEnv(name));
  if (!Number.isFinite(value)) {
    throw new Error(`Value must be a valid number for ${name}`);
  }
  return value;
}
