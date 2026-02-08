package com.emoura.backend.service;

import com.emoura.backend.model.CartItem;
import com.emoura.backend.repo.CartRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class CartService {
  private final CartRepository cartRepository;

  public CartService(CartRepository cartRepository) {
    this.cartRepository = cartRepository;
  }

  public CartItem addOrUpdate(String userId, Long productId, int qty) {
    if (qty <= 0) {
      remove(userId, productId);
      return null;
    }
    CartItem item = cartRepository.findByUserIdAndProductId(userId, productId)
      .orElseGet(() -> CartItem.builder()
        .userId(userId)
        .productId(productId)
        .quantity(0)
        .build());

    item.setQuantity(qty);
    item.setUpdatedAt(Instant.now());
    return cartRepository.save(item);
  }

  public void remove(String userId, Long productId) {
    cartRepository.findByUserIdAndProductId(userId, productId)
      .ifPresent(cartRepository::delete);
  }

  public List<CartItem> listItems(String userId) {
    return cartRepository.findByUserIdOrderByUpdatedAtDesc(userId);
  }
}