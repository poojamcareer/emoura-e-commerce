package com.emoura.backend;

import com.emoura.backend.model.Product;
import com.emoura.backend.repo.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedData {
  @Bean
  CommandLineRunner seed(ProductRepository repo) {
    return args -> {
      if (repo.count() == 0) {
        repo.save(Product.builder().name("Classic Sneaker").category("footwear").price(79.99).rating(4.5).imageUrl("/images/footwear1.jpg").description("Everyday comfort").build());
        repo.save(Product.builder().name("Street Runner").category("footwear").price(99.99).rating(4.7).imageUrl("/images/footwear2.jpg").description("Lightweight performance").build());
        repo.save(Product.builder().name("Everyday Tote").category("bag").price(59.99).rating(4.3).imageUrl("/images/bag1.jpg").description("Carry essentials").build());
        repo.save(Product.builder().name("Travel Duffel").category("bag").price(129.99).rating(4.8).imageUrl("/images/bag2.jpg").description("Weekend ready").build());
      }
    };
  }
}
