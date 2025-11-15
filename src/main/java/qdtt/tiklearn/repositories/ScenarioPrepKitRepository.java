package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import qdtt.tiklearn.entity.ScenarioPrepKit;

import java.util.List;

@Repository
public interface ScenarioPrepKitRepository extends JpaRepository<ScenarioPrepKit, Long> {

    // Lấy tất cả các từ vựng (flashcard) theo ID của kịch bản
    List<ScenarioPrepKit> findByScenario_Id(Long scenarioId);
}
