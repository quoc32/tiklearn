package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;

    @Column(nullable = false)
    private String topic;

    @Column(name = "video_path", nullable = false)
    private String videoPath;

    @Column(name = "media_type", nullable = false)
    private String mediaType; // "VIDEO" or "IMAGE"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VideoStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = VideoStatus.DRAFT;
        }
    }

    // Constructors
    public Video() {}

    public Video(String word, String topic, String videoPath) {
        this.word = word;
        this.topic = topic;
        this.videoPath = videoPath;
        this.mediaType = "VIDEO"; // Default to VIDEO for backward compatibility
        this.status = VideoStatus.DRAFT;
    }

    public Video(String word, String topic, String videoPath, String mediaType) {
        this.word = word;
        this.topic = topic;
        this.videoPath = videoPath;
        this.mediaType = mediaType;
        this.status = VideoStatus.DRAFT;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getVideoPath() {
        return videoPath;
    }

    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public VideoStatus getStatus() {
        return status;
    }

    public void setStatus(VideoStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
