/**
 * Utility functions for the markdown editor components
 */

/**
 * Replace technical placeholder IDs with user-friendly placeholders
 */
export const createUserFriendlyDisplay = (
  value: string,
  uploadedFiles: Map<string, File>
): string => {
  if (!value || !uploadedFiles.size) return value;

  let displayText = value;

  for (const [placeholderId, file] of uploadedFiles.entries()) {
    const userFriendlyPlaceholder = `[📷 Image: ${file.name}]`;

    // Pattern 1: ![alt](placeholderId) -> [📷 Image: filename]
    const cleanPattern = new RegExp(
      `!\\[([^\\]]*)\\]\\(${placeholderId.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )}\\)`,
      "g"
    );
    displayText = displayText.replace(cleanPattern, userFriendlyPlaceholder);

    // Pattern 2: Malformed ![alt](![alt](placeholderId)) -> [📷 Image: filename]
    const malformedPattern = new RegExp(
      `!\\[([^\\]]*)\\]\\(!\\[([^\\]]*)\\]\\(${placeholderId.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )}\\)\\)`,
      "g"
    );
    displayText = displayText.replace(
      malformedPattern,
      userFriendlyPlaceholder
    );
  }

  return displayText;
};

/**
 * Convert display value back to actual value with technical placeholders
 */
export const convertDisplayToActual = (
  displayVal: string,
  uploadedFiles: Map<string, File>
): string => {
  if (!displayVal || !uploadedFiles.size) return displayVal;

  let actualValue = displayVal;

  for (const [placeholderId, file] of uploadedFiles.entries()) {
    const userFriendlyPlaceholder = `[📷 Image: ${file.name}]`;
    const escapedDisplayPlaceholder = userFriendlyPlaceholder.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(escapedDisplayPlaceholder, "g");
    actualValue = actualValue.replace(
      regex,
      `![${file.name.replace(/\.[^/.]+$/, "")}](${placeholderId})`
    );
  }

  return actualValue;
};

/**
 * Extract placeholder ID from image src attribute
 */
export const extractPlaceholderId = (src: string): string | null => {
  if (!src) return null;

  // Check if src is directly a placeholder ID
  if (src.startsWith("img-")) {
    return src;
  }

  // Try to extract placeholder ID from malformed markdown
  const match = src.match(/img-\d+-[a-z0-9]+/);
  return match ? match[0] : null;
};
