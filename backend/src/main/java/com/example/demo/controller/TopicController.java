package com.example.demo.controller;

import com.example.demo.entity.Topic;
import com.example.demo.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/topics")
public class TopicController {

    @Autowired
    private TopicService topicService;

    /**
     * Lấy danh sách tất cả chủ đề
     * GET /admin/topics
     */
    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics() {
        List<Topic> topics = topicService.getAllTopics();
        return ResponseEntity.ok(topics);
    }

    /**
     * Lấy chủ đề theo ID
     * GET /admin/topics/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable Long id) {
        try {
            Topic topic = topicService.getTopicById(id);
            return ResponseEntity.ok(topic);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Tạo chủ đề mới
     * POST /admin/topics
     */
    @PostMapping
    public ResponseEntity<?> createTopic(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Topic name is required"));
            }
            
            Topic topic = topicService.createTopic(name);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "message", "Topic created successfully", "topic", topic));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Cập nhật chủ đề
     * PUT /admin/topics/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTopic(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String newName = request.get("name");
            if (newName == null || newName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Topic name is required"));
            }
            
            Topic topic = topicService.updateTopic(id, newName);
            return ResponseEntity.ok(Map.of("success", true, "message", "Topic updated successfully", "topic", topic));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Xóa chủ đề
     * DELETE /admin/topics/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        try {
            topicService.deleteTopic(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Topic deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
