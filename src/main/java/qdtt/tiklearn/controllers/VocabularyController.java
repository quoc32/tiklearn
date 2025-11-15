package qdtt.tiklearn.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import qdtt.tiklearn.entity.Vocabulary;
import qdtt.tiklearn.repositories.TopicRepository;
import qdtt.tiklearn.services.VocabularyService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/vocabularies")
public class VocabularyController {

    @Autowired
    private VocabularyService vocabularyService;

    @Autowired
    private TopicRepository topicRepository;

    /**
     * Generate vocabularies for a specific topic
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateVocabularies(
            @RequestParam String topic,
            @RequestParam(defaultValue = "10") int count) {
        try {
            List<Vocabulary> vocabularies = vocabularyService.generateVocabulariesForTopic(topic, count);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Generated " + vocabularies.size() + " vocabularies for topic: " + topic);
            response.put("vocabularies", vocabularies);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to generate vocabularies: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Generate vocabularies for all topics in database
     */
    @PostMapping("/generate-all")
    public ResponseEntity<?> generateVocabulariesForAllTopics(
            @RequestParam(defaultValue = "5") int countPerTopic) {
        try {
            // Get all topics from database
            List<String> topics = topicRepository.findAll()
                    .stream()
                    .map(topic -> topic.getName())
                    .collect(Collectors.toList());
            
            if (topics.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "No topics found in database. Please create topics first.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            List<Vocabulary> vocabularies = vocabularyService.generateVocabulariesForAllTopics(topics, countPerTopic);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Generated " + vocabularies.size() + " vocabularies for " + topics.size() + " topics");
            response.put("vocabularies", vocabularies);
            response.put("topicsProcessed", topics.size());
            response.put("countPerTopic", countPerTopic);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to generate vocabularies: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Get all vocabularies
     */
    @GetMapping
    public ResponseEntity<List<Vocabulary>> getAllVocabularies() {
        List<Vocabulary> vocabularies = vocabularyService.getAllVocabularies();
        return ResponseEntity.ok(vocabularies);
    }

    /**
     * Get vocabularies by topic
     */
    @GetMapping("/topic/{topic}")
    public ResponseEntity<List<Vocabulary>> getVocabulariesByTopic(@PathVariable String topic) {
        List<Vocabulary> vocabularies = vocabularyService.getVocabulariesByTopic(topic);
        return ResponseEntity.ok(vocabularies);
    }

    /**
     * Delete a vocabulary
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVocabulary(@PathVariable Long id) {
        try {
            vocabularyService.deleteVocabulary(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vocabulary deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete vocabulary: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
