package com.emoura.backend.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
  private static class OtpEntry {
    final String code;
    final Instant expiresAt;

    OtpEntry(String code, Instant expiresAt) {
      this.code = code;
      this.expiresAt = expiresAt;
    }
  }

  private final SecureRandom random = new SecureRandom();
  private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

  public String requestOtp(String identifier) {
    String code = String.format("%06d", random.nextInt(1_000_000));
    otpStore.put(identifier, new OtpEntry(code, Instant.now().plusSeconds(300)));
    return code;
  }

  public boolean verifyOtp(String identifier, String code) {
    OtpEntry entry = otpStore.get(identifier);
    if (entry == null) return false;
    if (Instant.now().isAfter(entry.expiresAt)) {
      otpStore.remove(identifier);
      return false;
    }
    boolean ok = entry.code.equals(code);
    if (ok) otpStore.remove(identifier);
    return ok;
  }
}