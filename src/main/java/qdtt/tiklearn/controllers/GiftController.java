package qdtt.tiklearn.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import qdtt.tiklearn.entity.Gift;
import qdtt.tiklearn.services.GiftService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/gifts")
public class GiftController {

    @Autowired
    private GiftService giftService;

    @GetMapping
    public List<Gift> getAll() {
        return giftService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gift> getById(@PathVariable Long id) {
        return giftService.findById(id)
                .map(g -> ResponseEntity.ok(g))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Gift> create(@RequestBody Gift payload) {
        Gift created = giftService.create(payload);
        return ResponseEntity.created(URI.create("/api/gifts/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gift> update(@PathVariable Long id, @RequestBody Gift payload) {
        Gift updated = giftService.update(id, payload);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        giftService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // Upload gift image
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
        }

        try {
            String uploadsDir = "uploads/product";
            Path uploadPath = Paths.get(uploadsDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String filename = System.currentTimeMillis() + "-" + Math.abs(original != null ? original.hashCode() : file.hashCode()) + ext;
            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target);

            // Return public path (served by ResourceHandler at /uploads/**)
            String publicPath = "/uploads/product/" + filename;
            Map<String, String> resp = new HashMap<>();
            resp.put("path", publicPath);
            resp.put("filename", filename);
            return ResponseEntity.ok(resp);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to save file"));
        }
    }
}
