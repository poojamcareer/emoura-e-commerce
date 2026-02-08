package com.emoura.backend.service;

import com.emoura.backend.model.Product;
import com.emoura.backend.model.WishlistItem;
import com.emoura.backend.repo.ProductRepository;
import com.emoura.backend.repo.WishlistRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {
  private final WishlistRepository wishlistRepository;
  private final ProductRepository productRepository;

  public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository) {
    this.wishlistRepository = wishlistRepository;
    this.productRepository = productRepository;
  }

  public WishlistItem add(String userId, Long productId) {
    return wishlistRepository.findByUserIdAndProductId(userId, productId)
      .orElseGet(() -> wishlistRepository.save(WishlistItem.builder()
        .userId(userId)
        .productId(productId)
        .createdAt(Instant.now())
        .build()));
  }

  public void remove(String userId, Long productId) {
    wishlistRepository.findByUserIdAndProductId(userId, productId)
      .ifPresent(wishlistRepository::delete);
  }

  public List<Product> listProducts(String userId) {
    return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
      .map(i -> productRepository.findById(i.getProductId()).orElse(null))
      .filter(p -> p != null)
      .collect(Collectors.toList());
  }
}