/**
 * Generate a short, URL-friendly share ID for designs.
 *
 * Format: 8 characters using base36 (0-9, a-z)
 * Provides ~2.8 trillion possible combinations for collision resistance.
 *
 * @returns A unique 8-character share ID
 */
export function generateShareId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate that a share ID matches the expected format.
 *
 * @param shareId - The share ID to validate
 * @returns True if the share ID is valid format
 */
export function isValidShareId(shareId: string): boolean {
  return /^[0-9a-z]{8}$/.test(shareId);
}
