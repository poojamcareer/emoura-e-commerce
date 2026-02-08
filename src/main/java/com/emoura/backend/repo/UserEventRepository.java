package com.emoura.backend.repo;

import com.emoura.backend.model.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserEventRepository extends JpaRepository<UserEvent, Long> {
  List<UserEvent> findTop20BySessionIdOrderByCreatedAtDesc(String sessionId);
  List<UserEvent> findTop20BySessionIdAndEventTypeOrderByCreatedAtDesc(String sessionId, String eventType);
}