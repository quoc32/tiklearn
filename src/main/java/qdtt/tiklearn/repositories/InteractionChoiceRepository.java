package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import qdtt.tiklearn.entity.InteractionChoice;

@Repository
public interface InteractionChoiceRepository extends JpaRepository<InteractionChoice, Long> {
    // Không cần hàm gì đặc biệt, JpaRepository là đủ
}
