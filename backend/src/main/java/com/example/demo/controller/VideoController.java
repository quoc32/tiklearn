package com.example.demo.controller;

import com.example.demo.entity.Video;
import com.example.demo.entity.VideoStatus;
import com.example.demo.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    /**
     * Upload video với metadata
     * POST /admin/videos/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("word") String word,
            @RequestParam("topic") String topic,
            @RequestParam("difficultLevel") String difficultLevel,
            @RequestParam("description") String description) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            Video video = videoService.uploadVideo(file, word, topic, description, difficultLevel);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Video uploaded successfully");
            response.put("video", video);
            response.put("videoUrl", "/videos/" + video.getVideoPath());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to upload video: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Lấy danh sách tất cả video
     * GET /admin/videos
     */
    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos() {
        List<Video> videos = videoService.getAllVideos();
        return ResponseEntity.ok(videos);
    }

    /**
     * Lấy danh sách tất cả video (alias)
     * GET /admin/videos/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<Video>> getAllVideosAlias() {
        List<Video> videos = videoService.getAllVideos();
        return ResponseEntity.ok(videos);
    }

    /**
     * Lấy video theo ID
     * GET /admin/videos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getVideoById(@PathVariable Long id) {
        try {
            Video video = videoService.getVideoById(id);
            return ResponseEntity.ok(video);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Duyệt video (chuyển từ DRAFT sang APPROVED)
     * PUT /admin/videos/{id}/approve
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveVideo(@PathVariable Long id) {
        try {
            Video video = videoService.approveVideo(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Video approved successfully");
            response.put("video", video);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Cập nhật trạng thái video
     * PUT /admin/videos/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateVideoStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String statusStr = body.get("status");
            VideoStatus status = VideoStatus.valueOf(statusStr);
            Video video = videoService.updateVideoStatus(id, status);
            return ResponseEntity.ok(Map.of("success", true, "video", video));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Lấy video theo trạng thái
     * GET /admin/videos/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Video>> getVideosByStatus(@PathVariable VideoStatus status) {
        List<Video> videos = videoService.getVideosByStatus(status);
        return ResponseEntity.ok(videos);
    }

    /**
     * Lấy video theo chủ đề
     * GET /admin/videos/topic/{topic}
     */
    @GetMapping("/topic/{topic}")
    public ResponseEntity<List<Video>> getVideosByTopic(@PathVariable String topic) {
        List<Video> videos = videoService.getVideosByTopic(topic);
        return ResponseEntity.ok(videos);
    }

    /**
     * Xóa video
     * DELETE /admin/videos/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Video deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
