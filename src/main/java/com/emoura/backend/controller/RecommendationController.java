package com.emoura.backend.controller;

import com.emoura.backend.model.Product;
import com.emoura.backend.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {
  private final RecommendationService recommendationService;

  public RecommendationController(RecommendationService recommendationService) {
    this.recommendationService = recommendationService;
  }

  @GetMapping
  public List<Product> getRecommendations(@RequestParam("sessionId") String sessionId) {
    return recommendationService.recommendForSession(sessionId);
  }
}
