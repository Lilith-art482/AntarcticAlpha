// Admin code verification utilities
// The code is stored as obfuscated to prevent easy discovery

// Admins who do NOT need code verification (exempt users)
const EXEMPT_USER_IDS = ['1', '3']; // Артём (id: 1) и Ксения (id: 3)

// Verify the admin code (46258)
// Code is obfuscated using String.fromCharCode to prevent simple text search
export const verifyAdminCode = (code: string, userId?: string): boolean => {
  // Если пользователь в списке исключений, код не требуется
  if (userId && EXEMPT_USER_IDS.includes(userId)) {
    return true;
  }
  
  const obfuscatedCode = String.fromCharCode(52) + String.fromCharCode(54) + String.fromCharCode(50) + String.fromCharCode(53) + String.fromCharCode(56)
  return code === obfuscatedCode
}

