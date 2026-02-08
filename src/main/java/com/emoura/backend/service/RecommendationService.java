package com.emoura.backend.service;

import com.emoura.backend.model.Product;
import com.emoura.backend.model.UserEvent;
import com.emoura.backend.repo.ProductRepository;
import com.emoura.backend.repo.UserEventRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
  private final ProductRepository productRepository;
  private final UserEventRepository userEventRepository;

  public RecommendationService(ProductRepository productRepository, UserEventRepository userEventRepository) {
    this.productRepository = productRepository;
    this.userEventRepository = userEventRepository;
  }

  public List<Product> recommendForSession(String sessionId) {
    List<UserEvent> events = userEventRepository.findTop20BySessionIdAndEventTypeOrderByCreatedAtDesc(sessionId, "view");
    Set<String> categories = new HashSet<>();

    for (UserEvent e : events) {
      if (e.getProductId() != null) {
        productRepository.findById(e.getProductId()).ifPresent(p -> {
          if (p.getCategory() != null && !p.getCategory().isBlank()) {
            categories.add(p.getCategory());
          }
        });
      }
      if (e.getEventType() != null && !e.getEventType().isBlank()) {
        if (e.getEventType().startsWith("category:")) {
          categories.add(e.getEventType().substring("category:".length()));
        }
      }
    }

    List<Product> pool = new ArrayList<>();
    if (!categories.isEmpty()) {
      for (String cat : categories) {
        pool.addAll(productRepository.findByCategoryIgnoreCase(cat));
      }
    }
    if (pool.isEmpty()) {
      pool = productRepository.findAll();
    }
    Collections.shuffle(pool);
    return pool.stream().limit(8).collect(Collectors.toList());
  }

  public UserEvent logEvent(String sessionId, String eventType, Long productId) {
    UserEvent e = UserEvent.builder()
      .sessionId(sessionId)
      .eventType(eventType)
      .productId(productId)
      .createdAt(Instant.now())
      .build();
    return userEventRepository.save(e);
  }
}
