import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rate-limiter";

describe("checkRateLimit", () => {
  it("allows requests under the rate limit threshold", () => {
    const testIp = "192.168.1.100";
    const result1 = checkRateLimit(testIp, 3, 1000);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = checkRateLimit(testIp, 3, 1000);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = checkRateLimit(testIp, 3, 1000);
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it("blocks requests that exceed the rate limit threshold", () => {
    const testIp = "192.168.1.101";
    checkRateLimit(testIp, 2, 5000);
    checkRateLimit(testIp, 2, 5000);

    const blockedResult = checkRateLimit(testIp, 2, 5000);
    expect(blockedResult.allowed).toBe(false);
    expect(blockedResult.remaining).toBe(0);
    expect(blockedResult.resetSeconds).toBeGreaterThan(0);
  });
});
