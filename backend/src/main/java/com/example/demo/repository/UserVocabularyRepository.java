package qdtt.tiklearn.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import qdtt.tiklearn.entity.LearningStatus;
import qdtt.tiklearn.entity.UserVocabulary;

import java.util.List;
import java.util.Optional;

public interface UserVocabularyRepository extends JpaRepository<UserVocabulary, Long> {
    Optional<UserVocabulary> findByUser_IdAndVocabulary_Id(Long userId, Long vocabularyId);

    // Tìm các từ [Chưa học] theo chủ đề
    @Query("SELECT uv FROM UserVocabulary uv " +
            "WHERE uv.user.id = :userId AND uv.status = :status " +
            "AND uv.vocabulary.topic = :topicName")
    List<UserVocabulary> findByUserAndStatusAndTopic(
            Long userId,
            LearningStatus status,
            String topicName,
            Pageable pageable
    );

        // Count learned vocabularies for a user
        long countByUser_IdAndStatus(Long userId, LearningStatus status);

        // List all learned vocabularies for a user
        List<UserVocabulary> findByUser_IdAndStatus(Long userId, LearningStatus status);

        // List learned vocabularies with pagination/limit support
        List<UserVocabulary> findByUser_IdAndStatus(Long userId, LearningStatus status, Pageable pageable);
}
