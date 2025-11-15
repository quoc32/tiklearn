package qdtt.tiklearn.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
public class LearningController {

    @Autowired
    private LearningService learningService;

    // Debug endpoints
    @GetMapping("/debug/user-vocab")
    public ResponseEntity<?> debugUserVocab(@RequestParam Long userId, @RequestParam Long vocabId) {
        boolean found = learningService.hasUserVocabulary(userId, vocabId);
        return ResponseEntity.ok(Collections.singletonMap("found", found));
    }

    @GetMapping("/debug/user-vocabularies")
    public ResponseEntity<?> debugUserVocabularies(@RequestParam Long userId) {
        List<Long> ids = learningService.getUserVocabularyVocabularyIds(userId);
        return ResponseEntity.ok(Collections.singletonMap("vocabularyIds", ids));
    }

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

        // Extra debug: count how many results arrived as correct=true
        long trueCount = results.stream().filter(QuizResultDTO::isCorrect).count();
        log.info("Payload debug: {} items marked correct=true", trueCount);
        log.info("Full payload: {}", results);

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

    // API: Đếm số từ đã học của user
    @GetMapping("/users/{userId}/vocabularies/learned/count")
    public ResponseEntity<Map<String, Long>> countLearned(@PathVariable Long userId) {
        long count = learningService.countLearnedForUser(userId);
        return ResponseEntity.ok(Collections.singletonMap("count", count));
    }

    // API: Lấy danh sách từ đã học (tất cả hoặc giới hạn bằng query param `limit`)
    @GetMapping("/users/{userId}/vocabularies/learned")
    public ResponseEntity<List<LearningFlowDTO>> getLearnedVocabularies(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer limit) {

        List<LearningFlowDTO> list;
        if (limit != null) {
            list = learningService.getLearnedForUserWithLimit(userId, limit);
        } else {
            list = learningService.getAllLearnedForUser(userId);
        }

        return ResponseEntity.ok(list);
    }
}