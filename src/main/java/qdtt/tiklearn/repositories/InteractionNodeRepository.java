package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import qdtt.tiklearn.entity.InteractionNode;

import java.util.Optional;

@Repository
public interface InteractionNodeRepository extends JpaRepository<InteractionNode, Long> {

    // Tìm video bắt đầu (video gốc) của một kịch bản
    Optional<InteractionNode> findByScenario_IdAndIsStartingNodeTrue(Long scenarioId);
}
