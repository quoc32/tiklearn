package qdtt.tiklearn.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import qdtt.tiklearn.dto.LearningFlowDTO;
import qdtt.tiklearn.dto.QuizResultDTO;
import qdtt.tiklearn.dto.QuizSubmissionResponseDTO;
import qdtt.tiklearn.dto.TopicDTO;
import qdtt.tiklearn.services.LearningService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningController {

    @Autowired
    private LearningService learningService;

    // API: Lấy tất cả chủ đề
    @GetMapping("/topics")
    public ResponseEntity<List<TopicDTO>> getTopics() {
        log.info("Getting all topics");
        return ResponseEntity.ok(learningService.getAllTopics());
    }

    // API: Lấy lô từ vựng
    @GetMapping("/learn/{topicId}")
    public ResponseEntity<List<LearningFlowDTO>> getLearningBatch(
            @PathVariable Long topicId,
            @RequestParam(defaultValue = "10") int limit) {

        Long userId = 1L; // Hardcode để test
        log.info("Getting learning batch for user {} and topic {} with limit {}", userId, topicId, limit);

        List<LearningFlowDTO> batch = learningService.getLearningBatch(userId, topicId, limit);
        log.info("Returning {} words", batch.size());

        return ResponseEntity.ok(batch);
    }

    // API: Nộp bài Quiz - ĐÃ THÊM LOGGING
    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizSubmissionResponseDTO> submitQuiz(
            @RequestBody List<QuizResultDTO> results) {

        Long userId = 1L; // Hardcode để test
        log.info("=== QUIZ SUBMISSION ===");
        log.info("User ID: {}", userId);
        log.info("Received {} results", results.size());

        // Log từng result để debug
        for (int i = 0; i < results.size(); i++) {
            QuizResultDTO result = results.get(i);
            log.info("Result #{}: vocabId={}, correct={}", i + 1, result.getVocabularyId(), result.isCorrect());
        }

        QuizSubmissionResponseDTO response = learningService.submitQuizResults(userId, results);

        log.info("Response: correct={}, total={}", response.getCorrect(), response.getTotal());
        log.info("=== END QUIZ SUBMISSION ===");

        return ResponseEntity.ok(response);
    }
}