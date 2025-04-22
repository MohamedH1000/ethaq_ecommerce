export function formatPhoneNumber(phone: string, countryCode = "966"): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Handle local format (0XXXXXXXX)
  if (digits.startsWith("0")) {
    return `+${countryCode}${digits.substring(1)}`;
  }

  // Handle international format without +
  if (!digits.startsWith("+") && digits.length >= 9) {
    return `+${digits}`;
  }

  // Return as-is if already in international format
  return digits.startsWith("+") ? digits : `+${countryCode}${digits}`;
}
