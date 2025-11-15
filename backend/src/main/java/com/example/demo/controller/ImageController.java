package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.entity.Video;

import com.example.demo.service.VideoService;

import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;

@RestController
public class ImageController {

    @Autowired
    private VideoService videoService;

    @PostMapping(value = "/api/image", consumes = "application/json", produces = "application/json")
    public org.springframework.http.ResponseEntity<java.util.Map<String, Object>> getImageOrVideo(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, java.util.List<String>> payload) throws IOException {
        java.util.List<String> daCo = payload != null ? payload.get("da_co") : null;

        ClassPathResource staticDir = new ClassPathResource("static/photos");
        java.io.File dir = staticDir.getFile();
        java.io.File[] files = dir.listFiles();

        if (files != null) {
            java.util.List<java.io.File> candidates = new java.util.ArrayList<>();
            for (java.io.File f : files) {
                if (!f.isFile()) continue;
                String name = f.getName();
                String base = name.contains(".") ? name.substring(0, name.lastIndexOf('.')) : name;

                if (daCo != null && daCo.contains(base)) continue;

                candidates.add(f);
            }

            if (!candidates.isEmpty()) {
                int idx = java.util.concurrent.ThreadLocalRandom.current().nextInt(candidates.size());
                java.io.File f = candidates.get(idx);

                byte[] data = java.nio.file.Files.readAllBytes(f.toPath());
                String b64 = java.util.Base64.getEncoder().encodeToString(data);

                String name = f.getName();
                String base = name.contains(".") ? name.substring(0, name.lastIndexOf('.')) : name;
                Object idValue = base; // keep id as string (e.g. UUID)

                java.util.Map<String, Object> body = new java.util.HashMap<>();
                body.put("image", b64);
                body.put("id", idValue);

                // Lấy word , description và topic từ VideoService
                Video video = videoService.getVideoByVideoPathThatInclue(idValue.toString());
                if (video != null) {
                    body.put("word", video.getWord());
                    body.put("description", video.getDescription());
                    body.put("topic", video.getTopic());
                }

                return org.springframework.http.ResponseEntity
                        .ok()
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(body);
            }
        }

        return org.springframework.http.ResponseEntity.notFound().build();
    }
}
