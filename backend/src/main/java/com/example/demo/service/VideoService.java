package com.example.demo.service;

import com.example.demo.entity.Video;
import com.example.demo.entity.VideoStatus;
import com.example.demo.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    private static final String VIDEO_UPLOAD_DIR = "src/main/resources/static/videos/";
    private static final String IMAGE_UPLOAD_DIR = "src/main/resources/static/photos/";

    public Video uploadVideo(MultipartFile file, String word, String topic, String description, String difficultLevel) throws IOException {
        // Determine media type based on file content type
        String contentType = file.getContentType();
        String mediaType = "VIDEO";
        String uploadDir = VIDEO_UPLOAD_DIR;
        
        if (contentType != null && contentType.startsWith("image/")) {
            mediaType = "IMAGE";
            uploadDir = IMAGE_UPLOAD_DIR;
        }

        // Create directory if not exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save file to disk
        Path filePath = Paths.get(uploadDir + uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create video entity with media type
        Video video = new Video(word, topic, description, uniqueFilename, mediaType, difficultLevel);
        return videoRepository.save(video);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found with id: " + id));
    }

    public Video getVideoByVideoPathThatInclue(String path) {
        return videoRepository.findByVideoPathContaining(path);
    }

    public Video approveVideo(Long id) {
        Video video = getVideoById(id);
        video.setStatus(VideoStatus.APPROVED);
        return videoRepository.save(video);
    }

    public Video updateVideoStatus(Long id, VideoStatus status) {
        Video video = getVideoById(id);
        video.setStatus(status);
        return videoRepository.save(video);
    }

    public List<Video> getVideosByStatus(VideoStatus status) {
        return videoRepository.findByStatus(status);
    }

    public List<Video> getVideosByTopic(String topic) {
        return videoRepository.findByTopic(topic);
    }

    public void deleteVideo(Long id) {
        Video video = getVideoById(id);
        
        // Delete file from disk
        try {
            String uploadDir = "IMAGE".equals(video.getMediaType()) ? IMAGE_UPLOAD_DIR : VIDEO_UPLOAD_DIR;
            Path filePath = Paths.get(uploadDir + video.getVideoPath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
        
        // Delete from database
        videoRepository.delete(video);
    }
}
