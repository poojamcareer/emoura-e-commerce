package com.emoura.backend.controller;

import com.emoura.backend.model.User;
import com.emoura.backend.repo.UserRepository;
import com.emoura.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
  private final UserRepository userRepository;
  private final UserService userService;

  public UserController(UserRepository userRepository, UserService userService) {
    this.userRepository = userRepository;
    this.userService = userService;
  }

  @GetMapping
  public List<User> listUsers() {
    return userRepository.findAll();
  }

  @GetMapping("/by-mobile")
  public User getByMobile(@RequestParam("mobile") String mobile) {
    return userRepository.findByMobile(mobile).orElse(null);
  }

  public static class ProfileUpdate {
    public String mobile;
    public String name;
    public String email;
    public String address;
    public String pincode;
  }

  @PostMapping("/profile")
  public User upsertProfile(@RequestBody ProfileUpdate req) {
    return userService.upsertProfile(req.mobile, req.name, req.email, req.address, req.pincode);
  }
}