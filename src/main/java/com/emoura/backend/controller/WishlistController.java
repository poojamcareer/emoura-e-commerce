package com.emoura.backend.controller;

import com.emoura.backend.model.Product;
import com.emoura.backend.model.WishlistItem;
import com.emoura.backend.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {
  private final WishlistService wishlistService;

  public WishlistController(WishlistService wishlistService) {
    this.wishlistService = wishlistService;
  }

  @PostMapping
  public WishlistItem add(
      @RequestParam("userId") String userId,
      @RequestParam("productId") Long productId
  ) {
    return wishlistService.add(userId, productId);
  }

  @DeleteMapping
  public void remove(
      @RequestParam("userId") String userId,
      @RequestParam("productId") Long productId
  ) {
    wishlistService.remove(userId, productId);
  }

  @GetMapping
  public List<Product> list(@RequestParam("userId") String userId) {
    return wishlistService.listProducts(userId);
  }
}