export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const keyCandidates = [
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY?.trim() ?? ""
  ];
  const key = keyCandidates.find(Boolean) ?? "";

  if (!url || !key) {
    return null;
  }

  return { url, key };
}
