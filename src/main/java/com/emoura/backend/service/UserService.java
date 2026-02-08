package com.emoura.backend.service;

import com.emoura.backend.model.User;
import com.emoura.backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User upsertLogin(String mobile, String name) {
    return userRepository.findByMobile(mobile)
      .map(existing -> {
        if (name != null && !name.isBlank()) {
          existing.setName(name);
        }
        existing.setLastLoginAt(Instant.now());
        return userRepository.save(existing);
      })
      .orElseGet(() -> userRepository.save(User.builder()
        .mobile(mobile)
        .name(name)
        .createdAt(Instant.now())
        .lastLoginAt(Instant.now())
        .build()));
  }

  public User upsertProfile(String mobile, String name, String email, String address, String pincode) {
    return userRepository.findByMobile(mobile)
      .map(existing -> {
        if (name != null && !name.isBlank()) existing.setName(name);
        if (email != null && !email.isBlank()) existing.setEmail(email);
        if (address != null && !address.isBlank()) existing.setAddress(address);
        if (pincode != null && !pincode.isBlank()) existing.setPincode(pincode);
        return userRepository.save(existing);
      })
      .orElseGet(() -> userRepository.save(User.builder()
        .mobile(mobile)
        .name(name)
        .email(email)
        .address(address)
        .pincode(pincode)
        .createdAt(Instant.now())
        .lastLoginAt(Instant.now())
        .build()));
  }
}