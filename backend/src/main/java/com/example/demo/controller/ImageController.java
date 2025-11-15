package com.example.demo.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;

@RestController
public class ImageController {

    @PostMapping(value = "/api/image", consumes = "application/json", produces = "application/json")
    public org.springframework.http.ResponseEntity<java.util.Map<String, Object>> getImageOrVideo(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, java.util.List<Integer>> payload) throws IOException {
        java.util.List<Integer> daCo = payload != null ? payload.get("da_co") : null;

        ClassPathResource staticDir = new ClassPathResource("static");
        java.io.File dir = staticDir.getFile();
        java.io.File[] files = dir.listFiles();

        if (files != null) {
            for (java.io.File f : files) {
                if (!f.isFile()) continue;
                String name = f.getName();
                String base = name.contains(".") ? name.substring(0, name.lastIndexOf('.')) : name;

                boolean skip = false;
                if (daCo != null) {
                    try {
                        int id = Integer.parseInt(base);
                        if (daCo.contains(id)) skip = true;
                    } catch (NumberFormatException ignored) {
                        // not a number -> don't skip based on id list
                    }
                }
                if (skip) continue;

                byte[] data = java.nio.file.Files.readAllBytes(f.toPath());
                String b64 = java.util.Base64.getEncoder().encodeToString(data);

                Object idValue;
                try {
                    idValue = Integer.parseInt(base);
                } catch (NumberFormatException ex) {
                    idValue = base;
                }

                java.util.Map<String, Object> body = new java.util.HashMap<>();
                body.put("image", b64);
                body.put("id", idValue);

                return org.springframework.http.ResponseEntity
                        .ok()
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(body);
            }
        }

        return org.springframework.http.ResponseEntity.notFound().build();
    }
}
