package com.example.demo.repository;

import com.example.demo.entity.Video;
import com.example.demo.entity.VideoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByStatus(VideoStatus status);
    List<Video> findByTopic(String topic);
    List<Video> findByWord(String word);
}
