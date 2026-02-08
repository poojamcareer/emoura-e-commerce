package com.emoura.backend.controller;

import com.emoura.backend.model.Product;
import com.emoura.backend.service.RecommendationService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class RealtimeController {
  private final RecommendationService recommendationService;

  public RealtimeController(RecommendationService recommendationService) {
    this.recommendationService = recommendationService;
  }

  @MessageMapping("/recommend")
  @SendTo("/topic/recommendations")
  public List<Product> recommend(@Payload String sessionId) {
    return recommendationService.recommendForSession(sessionId);
  }
}
