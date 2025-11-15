package qdtt.tiklearn.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "vocabularies")
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;

    @Column(length = 1000)
    private String definition; // Tiếng Việt

    @Column(length = 1000)
    private String exampleSentence;

    private String partOfSpeech; // (adj), (v), (n)

    private String pronunciation; // (ví dụ: /ɪˈfɪʃənt/)

    @Column(nullable = false)
    private String topic;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "vocabulary", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserVocabulary> userVocabularies;
}