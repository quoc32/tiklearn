package qdtt.tiklearn.entity;

import jakarta.persistence.*;
import lombok.Data;
import qdtt.tiklearn.entity.LearningStatus;
import qdtt.tiklearn.entity.User;
import qdtt.tiklearn.entity.Vocabulary;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_vocabularies", uniqueConstraints = {
        // Đảm bảo một user chỉ có 1 bản ghi cho 1 từ vựng
        @UniqueConstraint(columnNames = {"user_id", "vocabulary_id"})
})
public class UserVocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_id", nullable = false)
    private Vocabulary vocabulary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LearningStatus status;

    // Các trường này để dành cho Module 3 (Ôn tập thông minh)
    @Column(name = "next_review_date")
    private LocalDateTime nextReviewDate;

    @Column(name = "review_interval")
    private Integer reviewInterval; // Số ngày

    public UserVocabulary() {
    }

    public UserVocabulary(User currentUser, Vocabulary vocab) {
    }

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = LearningStatus.NOT_LEARNED;
        }
        // Mặc định, từ mới sẽ được ôn lại sau 1 ngày
        if (nextReviewDate == null) {
            nextReviewDate = LocalDateTime.now().plusDays(1);
        }
        if (reviewInterval == null) {
            reviewInterval = 1;
        }
    }
}
