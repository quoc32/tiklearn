package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import qdtt.tiklearn.entity.Video;
import qdtt.tiklearn.entity.VideoStatus;
import qdtt.tiklearn.entity.Vocabulary;

import java.util.List;
import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Long> {
    Optional<Video> findFirstByVocabulary(Vocabulary vocabulary);
    List<Video> findByStatus(VideoStatus status);
    List<Video> findByTopic(String topic);
    List<Video> findByWord(String word);
    Video findByVideoPath(String path);
    Video findByVideoPathContaining(String path);
}
