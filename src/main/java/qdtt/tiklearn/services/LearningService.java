package qdtt.tiklearn.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import qdtt.tiklearn.dto.LearningFlowDTO;
import qdtt.tiklearn.dto.QuizResultDTO;
import qdtt.tiklearn.dto.QuizSubmissionResponseDTO;
import qdtt.tiklearn.dto.TopicDTO;
import qdtt.tiklearn.entity.*;
import qdtt.tiklearn.repositories.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class LearningService {

    @Autowired private TopicRepository topicRepo;
    @Autowired private VocabularyRepository vocabRepo;
    @Autowired private UserVocabularyRepository userVocabRepo;
    @Autowired private VideoRepository videoRepo;
    @Autowired private UserRepository userRepo;

    // Lấy danh sách chủ đề
    public List<TopicDTO> getAllTopics() {
        return topicRepo.findAll().stream()
                .map(this::mapToTopicDTO)
                .collect(Collectors.toList());
    }

    // Lấy lô từ vựng để học (theo chủ đề)
    @Transactional
    public List<LearningFlowDTO> getLearningBatch(Long userId, Long topicId, int limit) {
        List<UserVocabulary> learningBatch = new ArrayList<>();

        // 1. Lấy TÊN chủ đề
        Topic topic = topicRepo.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chủ đề: " + topicId));
        String topicName = topic.getName();

        // 2. Ưu tiên lấy các từ đang ở trạng thái [Chưa học]
        learningBatch = userVocabRepo.findByUserAndStatusAndTopic(
                userId, LearningStatus.NOT_LEARNED, topicName, PageRequest.of(0, limit)
        );

        // 3. Nếu không đủ 'limit', lấy thêm từ vựng MỚI
        if (learningBatch.size() < limit) {
            int needed = limit - learningBatch.size();
            List<Vocabulary> newVocabs = vocabRepo.findNewVocabulariesForUser(
                    userId, topicName, PageRequest.of(0, needed)
            );

            User currentUser = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user: " + userId));

            for (Vocabulary vocab : newVocabs) {
                UserVocabulary uv = new UserVocabulary(currentUser, vocab);
                learningBatch.add(userVocabRepo.save(uv));
            }
        }

        // 4. Map sang DTO để trả về
        return learningBatch.stream()
                .map(this::mapToLearningFlowDTO)
                .collect(Collectors.toList());
    }

    /**
     * Xử lý kết quả Quiz - ĐÃ SỬA ĐỂ DEBUG VÀ FIX BUG
     */
    @Transactional
    public QuizSubmissionResponseDTO submitQuizResults(Long userId, List<QuizResultDTO> results) {
        log.info("=== SUBMIT QUIZ RESULTS ===");
        log.info("User ID: {}", userId);
        log.info("Results received: {}", results.size());

        int correctCount = 0;
        List<Long> missedWordIds = new ArrayList<>();

        for (int i = 0; i < results.size(); i++) {
            QuizResultDTO result = results.get(i);

            log.info("Processing result #{}: {}", i + 1, result);
            log.info("  - VocabularyId: {}", result.getVocabularyId());
            log.info("  - isCorrect(): {}", result.isCorrect());
            log.info("  - correct field: {}", result.isCorrect());

            UserVocabulary uv = userVocabRepo.findByUser_IdAndVocabulary_Id(userId, result.getVocabularyId())
                    .orElse(null);

            if (uv != null) {
                // SỬA: Sử dụng cả hai cách để đảm bảo
                boolean isCorrectResult = result.isCorrect();
                log.info("  - Final isCorrect value: {}", isCorrectResult);

                if (isCorrectResult) {
                    correctCount++;
                    uv.setStatus(LearningStatus.LEARNED);
                    log.info("  - ✓ CORRECT - Count now: {}", correctCount);
                } else {
                    uv.setStatus(LearningStatus.NOT_LEARNED);
                    missedWordIds.add(result.getVocabularyId());
                    log.info("  - ✗ INCORRECT - Added to missed");
                }
                userVocabRepo.save(uv);
                log.info("  - Updated UV status to {}", uv.getStatus());
            } else {
                log.warn("  - WARNING: UserVocabulary not found for vocabId: {}", result.getVocabularyId());
            }
        }

        QuizSubmissionResponseDTO response = new QuizSubmissionResponseDTO(correctCount, results.size(), missedWordIds);
        log.info("Final response: correct={}, total={}, missed={}", correctCount, results.size(), missedWordIds.size());
        log.info("=== END SUBMIT ===");

        return response;
    }

    // --- Helper Mappers ---

    // Count learned vocabularies for a user
    public long countLearnedForUser(Long userId) {
        return userVocabRepo.countByUser_IdAndStatus(userId, LearningStatus.LEARNED);
    }

    // Get all learned vocabularies for a user
    public List<LearningFlowDTO> getAllLearnedForUser(Long userId) {
        List<UserVocabulary> list = userVocabRepo.findByUser_IdAndStatus(userId, LearningStatus.LEARNED);
        return list.stream().map(this::mapToLearningFlowDTO).collect(Collectors.toList());
    }

    // Get learned vocabularies with limit
    public List<LearningFlowDTO> getLearnedForUserWithLimit(Long userId, int limit) {
        List<UserVocabulary> list = userVocabRepo.findByUser_IdAndStatus(userId, LearningStatus.LEARNED, PageRequest.of(0, Math.max(0, limit)));
        return list.stream().map(this::mapToLearningFlowDTO).collect(Collectors.toList());
    }

    // Debug helper: check if a UserVocabulary exists for user and vocab
    @Transactional
    public boolean hasUserVocabulary(Long userId, Long vocabId) {
        return userVocabRepo.findByUser_IdAndVocabulary_Id(userId, vocabId).isPresent();
    }

    @Transactional
    public List<Long> getUserVocabularyVocabularyIds(Long userId) {
        return userVocabRepo.findByUser_IdAndStatus(userId, LearningStatus.LEARNED)
                .stream()
                .map(uv -> uv.getVocabulary().getId())
                .collect(Collectors.toList());
    }

    private LearningFlowDTO mapToLearningFlowDTO(UserVocabulary uv) {
        Vocabulary vocab = uv.getVocabulary();
        Video video = videoRepo.findFirstByVocabulary(vocab).orElse(null);

        LearningFlowDTO dto = new LearningFlowDTO();
        dto.setId(vocab.getId());
        dto.setWord(vocab.getWord());
        dto.setPartOfSpeech(vocab.getPartOfSpeech());
        dto.setPronunciation(vocab.getPronunciation());
        dto.setMeaning(vocab.getDefinition());
        dto.setExampleSentence(vocab.getExampleSentence());
        dto.setVideoUrl(video != null ? video.getVideoPath() : "path/to/default/video.mp4");
        dto.setStatus(uv.getStatus().toString());
        return dto;
    }

    private TopicDTO mapToTopicDTO(Topic topic) {
        TopicDTO dto = new TopicDTO();
        dto.setId(topic.getId());
        dto.setName(topic.getName());
        return dto;
    }
}