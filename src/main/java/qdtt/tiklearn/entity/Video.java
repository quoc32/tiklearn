package qdtt.tiklearn.entity;

import jakarta.persistence.*;
import lombok.Data;
import qdtt.tiklearn.entity.Vocabulary;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết trực tiếp với từ vựng
    @ManyToOne
    @JoinColumn(name = "vocabulary_id", nullable = false)
    private Vocabulary vocabulary;

    @Column(name = "video_path", nullable = false)
    private String videoPath; // URL của video

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
}