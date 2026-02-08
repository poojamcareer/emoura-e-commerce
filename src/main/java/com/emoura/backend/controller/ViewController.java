package com.emoura.backend.controller;

import com.emoura.backend.model.Product;
import com.emoura.backend.model.UserEvent;
import com.emoura.backend.service.ViewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/views")
@CrossOrigin(origins = "*")
public class ViewController {
  private final ViewService viewService;

  public ViewController(ViewService viewService) {
    this.viewService = viewService;
  }

  @PostMapping
  public UserEvent logView(
      @RequestParam("sessionId") String sessionId,
      @RequestParam("productId") Long productId
  ) {
    return viewService.logView(sessionId, productId);
  }

  @GetMapping
  public List<Product> recentViews(@RequestParam("sessionId") String sessionId) {
    return viewService.recentViews(sessionId);
  }
}