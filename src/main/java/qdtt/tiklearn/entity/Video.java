package qdtt.tiklearn.entity;

import jakarta.persistence.*;
import lombok.Data;
import qdtt.tiklearn.entity.Vocabulary;

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

    @ManyToOne
    @JoinColumn(name = "vocabulary_id", nullable = false)
    private Vocabulary vocabulary;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "media_type", nullable = false)
    private String mediaType; // "VIDEO" or "IMAGE"

    @Column(name = "difficult_level", nullable = false)
    private String difficultLevel; // "EASY", "MEDIUM", "HARD"

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

    public Video(String word, String topic, String description, String videoPath) {
        this.description = description;
        this.word = word;
        this.topic = topic;
        this.videoPath = videoPath;
        this.mediaType = "VIDEO"; // Default to VIDEO for backward compatibility
        this.status = VideoStatus.DRAFT;
    }

    public Video(String word, String topic, String description, String videoPath, String mediaType, String difficultLevel) {
        this.word = word;
        this.topic = topic;
        this.videoPath = videoPath;
        this.mediaType = mediaType;
        this.status = VideoStatus.DRAFT;
        this.description = description;
        this.difficultLevel = difficultLevel;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getDifficultLevel() {
        return difficultLevel;
    }

    public void setDifficultLevel(String difficultLevel) {
        this.difficultLevel = difficultLevel;
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