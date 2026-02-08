package com.emoura.backend.repo;

import com.emoura.backend.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
  List<WishlistItem> findByUserIdOrderByCreatedAtDesc(String userId);
  Optional<WishlistItem> findByUserIdAndProductId(String userId, Long productId);
}