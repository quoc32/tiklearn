package qdtt.tiklearn.services;

import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageGenerationService {

    private static final Logger logger = LoggerFactory.getLogger(ImageGenerationService.class);

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Value("${huggingface.api.token}")
    private String apiToken;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(120, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .build();

    /**
     * Generate image from text prompt using HuggingFace Stable Diffusion API
     * @param prompt The text prompt to generate image from
     * @return File path of the generated image
     */
    public String generateImage(String prompt) throws IOException {
        logger.info("Generating image with prompt: {}", prompt);
        
        // Build request body with prompt
        RequestBody body = RequestBody.create(
            "{\"inputs\": \"" + escapeJson(prompt) + "\"}",
            MediaType.parse("application/json")
        );

        // Build request with authentication
        Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("Authorization", "Bearer " + apiToken)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        logger.info("Calling HuggingFace API: {}", apiUrl);
        
        // Execute request
        try (Response response = client.newCall(request).execute()) {
            logger.info("Response code: {}", response.code());
            
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error details";
                logger.error("HuggingFace API error: {} - {}", response.code(), errorBody);
                throw new IOException("Failed to generate image: " + response.code() + " - " + errorBody);
            }

            // Get image bytes from response
            byte[] imageBytes = response.body().bytes();
            logger.info("Received image data: {} bytes", imageBytes.length);

            // Generate unique filename
            String filename = "gen_" + UUID.randomUUID().toString() + ".png";
            
            // Save to BOTH locations so image is accessible immediately
            // 1. Save to target/classes (for immediate access while running)
            String targetDir = "target/classes/static/photos/";
            Path targetDirPath = Paths.get(targetDir);
            if (!Files.exists(targetDirPath)) {
                Files.createDirectories(targetDirPath);
            }
            File targetFile = new File(targetDir + filename);
            try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                fos.write(imageBytes);
            }
            
            // 2. Save to src/main/resources (for persistence after rebuild)
            String resourceDir = "src/main/resources/static/photos/";
            Path resourceDirPath = Paths.get(resourceDir);
            if (!Files.exists(resourceDirPath)) {
                Files.createDirectories(resourceDirPath);
            }
            File resourceFile = new File(resourceDir + filename);
            try (FileOutputStream fos = new FileOutputStream(resourceFile)) {
                fos.write(imageBytes);
            }
            
            logger.info("Image saved successfully to both locations: {}", filename);

            // Return the path without /photos/ prefix to match existing videos/images
            return filename;
        } catch (Exception e) {
            logger.error("Error generating image", e);
            throw e;
        }
    }

    /**
     * Escape special characters in JSON string
     */
    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
