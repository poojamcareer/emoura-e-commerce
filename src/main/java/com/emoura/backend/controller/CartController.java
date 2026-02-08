package com.emoura.backend.controller;

import com.emoura.backend.model.CartItem;
import com.emoura.backend.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
  private final CartService cartService;

  public CartController(CartService cartService) {
    this.cartService = cartService;
  }

  @PostMapping
  public CartItem add(
      @RequestParam("userId") String userId,
      @RequestParam("productId") Long productId,
      @RequestParam(value = "qty", defaultValue = "1") int qty
  ) {
    return cartService.addOrUpdate(userId, productId, qty);
  }

  @PutMapping
  public CartItem update(
      @RequestParam("userId") String userId,
      @RequestParam("productId") Long productId,
      @RequestParam("qty") int qty
  ) {
    return cartService.addOrUpdate(userId, productId, qty);
  }

  @DeleteMapping
  public void remove(
      @RequestParam("userId") String userId,
      @RequestParam("productId") Long productId
  ) {
    cartService.remove(userId, productId);
  }

  @GetMapping
  public List<CartItem> list(@RequestParam("userId") String userId) {
    return cartService.listItems(userId);
  }
}