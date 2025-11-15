package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import qdtt.tiklearn.entity.Video;
import qdtt.tiklearn.entity.Vocabulary;

import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Long> {
    Optional<Video> findFirstByVocabulary(Vocabulary vocabulary);
}
