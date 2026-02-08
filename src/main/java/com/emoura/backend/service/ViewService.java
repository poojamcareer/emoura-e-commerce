package com.emoura.backend.service;

import com.emoura.backend.model.Product;
import com.emoura.backend.model.UserEvent;
import com.emoura.backend.repo.ProductRepository;
import com.emoura.backend.repo.UserEventRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ViewService {
  private final UserEventRepository userEventRepository;
  private final ProductRepository productRepository;

  public ViewService(UserEventRepository userEventRepository, ProductRepository productRepository) {
    this.userEventRepository = userEventRepository;
    this.productRepository = productRepository;
  }

  public UserEvent logView(String sessionId, Long productId) {
    UserEvent e = UserEvent.builder()
      .sessionId(sessionId)
      .eventType("view")
      .productId(productId)
      .createdAt(Instant.now())
      .build();
    return userEventRepository.save(e);
  }

  public List<Product> recentViews(String sessionId) {
    return userEventRepository.findTop20BySessionIdAndEventTypeOrderByCreatedAtDesc(sessionId, "view").stream()
      .map(e -> productRepository.findById(e.getProductId()).orElse(null))
      .filter(p -> p != null)
      .collect(Collectors.toList());
  }
}