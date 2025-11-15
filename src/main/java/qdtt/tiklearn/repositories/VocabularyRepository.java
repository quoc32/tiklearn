package qdtt.tiklearn.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import qdtt.tiklearn.entity.Vocabulary;

import java.util.List;

public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    // Tìm các từ vựng mới mà user chưa học (chưa có trong bảng UserVocabulary)
    @Query("SELECT v FROM Vocabulary v WHERE v.topic = :topicName AND v.id NOT IN " +
            "(SELECT uv.vocabulary.id FROM UserVocabulary uv WHERE uv.user.id = :userId)")
    List<Vocabulary> findNewVocabulariesForUser(Long userId, String topicName, Pageable pageable);
    List<Vocabulary> findByTopic(String topic);
    long countByTopic(String topic);
}
