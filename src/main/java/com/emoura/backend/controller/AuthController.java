package com.emoura.backend.controller;

import com.emoura.backend.service.AuthService;
import com.emoura.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
  private final AuthService authService;
  private final UserService userService;

  public AuthController(AuthService authService, UserService userService) {
    this.authService = authService;
    this.userService = userService;
  }

  public static class OtpRequest {
    public String identifier;
    public String name;
  }

  public static class OtpVerifyRequest {
    public String identifier;
    public String code;
    public String name;
  }

  @PostMapping("/request-otp")
  public Map<String, Object> requestOtp(@RequestBody OtpRequest req) {
    String code = authService.requestOtp(req.identifier);
    // For demo only: returning OTP in response
    return Map.of("status", "sent", "otp", code);
  }

  @PostMapping("/verify-otp")
  public Map<String, Object> verifyOtp(@RequestBody OtpVerifyRequest req) {
    boolean ok = authService.verifyOtp(req.identifier, req.code);
    if (ok && req.identifier != null && !req.identifier.isBlank()) {
      userService.upsertLogin(req.identifier, req.name);
    }
    return Map.of("status", ok ? "verified" : "invalid");
  }
}