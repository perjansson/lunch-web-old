import type { PostgrestError } from "@supabase/supabase-js"
import type { Error } from "~/types"

export function logAndReturnError(
  message: string,
  originalError?: PostgrestError | null
): { error: Error } {
  console.error(message)

  return {
    error: {
      message,
      originalError: originalError ?? null,
    },
  }
}
