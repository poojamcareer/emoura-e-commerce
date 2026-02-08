package com.emoura.backend.repo;

import com.emoura.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
  List<CartItem> findByUserIdOrderByUpdatedAtDesc(String userId);
  Optional<CartItem> findByUserIdAndProductId(String userId, Long productId);
}