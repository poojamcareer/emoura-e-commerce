package com.emoura.backend.controller;

import com.emoura.backend.model.UserEvent;
import com.emoura.backend.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
  private final RecommendationService recommendationService;

  public EventController(RecommendationService recommendationService) {
    this.recommendationService = recommendationService;
  }

  @PostMapping
  public UserEvent logEvent(
      @RequestParam("sessionId") String sessionId,
      @RequestParam("eventType") String eventType,
      @RequestParam(value = "productId", required = false) Long productId
  ) {
    return recommendationService.logEvent(sessionId, eventType, productId);
  }
}
