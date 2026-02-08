package com.emoura.backend.service;

import com.emoura.backend.repo.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
  private final ProductRepository productRepository;

  public CategoryService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public List<String> listCategories() {
    return productRepository.findDistinctCategories();
  }
}