import { describe, it, expect } from "vitest";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

describe("Supabase Client and Auth Configuration", () => {
  it("should initialize browser Supabase client with defined project url and anon key", () => {
    const client = createBrowserClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(typeof client.auth.signInWithPassword).toBe("function");
    expect(typeof client.auth.signUp).toBe("function");
    expect(typeof client.auth.signOut).toBe("function");
  });

  it("should handle session retrieval structure gracefully", async () => {
    const client = createBrowserClient();
    const { data, error } = await client.auth.getSession();
    // In mock/test environment without network, it either returns null session or handles gracefully
    expect(error).toBeNull();
    expect(data).toHaveProperty("session");
  });
});
