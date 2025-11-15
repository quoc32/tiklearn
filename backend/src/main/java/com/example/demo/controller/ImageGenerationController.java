package com.example.demo.controller;

import com.example.demo.entity.Video;
import com.example.demo.repository.VideoRepository;
import com.example.demo.service.ImageGenerationService;
import com.example.demo.service.GeminiPromptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin/image-generation")
public class ImageGenerationController {

    @Autowired
    private ImageGenerationService imageGenerationService;

    @Autowired
    private GeminiPromptService geminiPromptService;

    @Autowired
    private VideoRepository videoRepository;

    /**
     * Enhance user prompt using Gemini API
     * POST /admin/image-generation/enhance-prompt
     * Body: { "prompt": "a cat" }
     */
    @PostMapping("/enhance-prompt")
    public ResponseEntity<Map<String, Object>> enhancePrompt(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String userPrompt = request.get("prompt");
            
            if (userPrompt == null || userPrompt.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Prompt is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Call Gemini API to enhance prompt
            String enhancedJson = geminiPromptService.enhancePrompt(userPrompt);
            
            response.put("success", true);
            response.put("originalPrompt", userPrompt);
            response.put("enhancedPrompt", enhancedJson);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to enhance prompt: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Generate image from text prompt
     * POST /admin/image-generation/generate
     * Body: { "prompt": "a beautiful sunset over mountains", "word": "sunset", "topic": "nature", "saveToDb": true/false }
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateImage(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String prompt = (String) request.get("prompt");
            String word = (String) request.getOrDefault("word", "generated");
            String topic = (String) request.getOrDefault("topic", "AI Generated");

            if (prompt == null || prompt.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Prompt is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Generate image using HuggingFace API
            String imagePath = imageGenerationService.generateImage(prompt);

            // Save to database
            Video video = new Video(word, topic, imagePath, "IMAGE");
            video = videoRepository.save(video);

            response.put("success", true);
            response.put("message", "Image generated successfully");
            response.put("imagePath", imagePath);
            response.put("imageId", video.getId());
            response.put("word", word);
            response.put("topic", topic);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to generate image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get recent generated images
     * GET /admin/image-generation/recent?limit=10
     */
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentImages(
            @RequestParam(defaultValue = "10") int limit) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Get recent images from database (where mediaType = "IMAGE")
            var images = videoRepository.findAll().stream()
                    .filter(v -> "IMAGE".equals(v.getMediaType()))
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(limit)
                    .toList();

            response.put("success", true);
            response.put("images", images);
            response.put("count", images.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to retrieve images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Save final accepted image with user input (word, topic, status=DRAFT)
     * POST /admin/image-generation/save-final
     * Body: { "imageData": "data:image/png;base64,...", "word": "cat", "topic": "animals", "prompt": "a cute cat", "status": "DRAFT" }
     */
    @PostMapping("/save-final")
    public ResponseEntity<Map<String, Object>> saveFinalImage(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String imageData = request.get("imageData");
            String word = request.get("word");
            String topic = request.get("topic");
            String status = request.getOrDefault("status", "DRAFT");
            
            if (imageData == null || !imageData.startsWith("data:image")) {
                response.put("success", false);
                response.put("message", "Invalid image data");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (word == null || word.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Word is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (topic == null || topic.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Topic is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Extract base64 data (remove "data:image/png;base64," prefix)
            String base64Data = imageData.substring(imageData.indexOf(",") + 1);
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            
            // Generate unique filename
            String filename = "gen_" + UUID.randomUUID().toString() + ".png";
            
            // Save to BOTH locations so image is accessible immediately
            // 1. Save to target/classes (for immediate access while running)
            String targetDir = "target/classes/static/photos/";
            Path targetDirPath = Paths.get(targetDir);
            if (!Files.exists(targetDirPath)) {
                Files.createDirectories(targetDirPath);
            }
            Path targetFilePath = Paths.get(targetDir + filename);
            try (FileOutputStream fos = new FileOutputStream(targetFilePath.toFile())) {
                fos.write(imageBytes);
            }
            
            // 2. Save to src/main/resources (for persistence after rebuild)
            String resourceDir = "src/main/resources/static/photos/";
            Path resourceDirPath = Paths.get(resourceDir);
            if (!Files.exists(resourceDirPath)) {
                Files.createDirectories(resourceDirPath);
            }
            Path resourceFilePath = Paths.get(resourceDir + filename);
            try (FileOutputStream fos = new FileOutputStream(resourceFilePath.toFile())) {
                fos.write(imageBytes);
            }
            
            // Store path without /photos/ prefix to match existing videos/images
            String imagePath = filename;
            
            // Save to database with status DRAFT and mediaType IMAGE
            Video video = new Video(word, topic, imagePath, "IMAGE");
            // Note: createdAt is automatically set by @PrePersist in Video entity
            video = videoRepository.save(video);
            
            response.put("success", true);
            response.put("message", "Image saved successfully with status DRAFT");
            response.put("imagePath", imagePath);
            response.put("imageId", video.getId());
            response.put("word", word);
            response.put("topic", topic);
            response.put("status", status);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to save image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
