package com.example.demo.repository;

import com.example.demo.entity.Vocabulary;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyRepository extends JpaRepository<Vocabulary, Long> {
    List<Vocabulary> findByTopic(String topic);
    long countByTopic(String topic);

    @Query("SELECT v FROM Vocabulary v WHERE v.topic = :topicName AND v.id NOT IN " +
            "(SELECT uv.vocabulary.id FROM UserVocabulary uv WHERE uv.user.id = :userId)")
    List<Vocabulary> findNewVocabulariesForUser(Long userId, String topicName, Pageable pageable);
}
