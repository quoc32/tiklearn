package qdtt.tiklearn.services;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Service
public class GeminiPromptService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiPromptService.class);
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    private final Gson gson = new Gson();
    
    /**
     * Enhance user prompt using Gemini API
     * @param userPrompt Original user prompt
     * @return Enhanced JSON response from Gemini
     */
    public String enhancePrompt(String userPrompt) throws Exception {
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=" + apiKey;
        
        logger.info("Calling Gemini API to enhance prompt: {}", userPrompt);
        
        // Build request body
        JsonObject requestBody = new JsonObject();
        JsonArray contents = new JsonArray();
        JsonObject content = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();
        
        String systemPrompt = "You are an AI prompt engineer specializing in educational content for English learners. "
                + "Convert the following vocabulary word or simple prompt into a detailed, child-friendly, cartoon-style image generation prompt. "
                + "The image should be:\n"
                + "- Friendly and approachable for beginners learning English\n"
                + "- Cute cartoon or animated illustration style\n"
                + "- Bright, colorful, and cheerful\n"
                + "- Clear and easy to understand visually\n"
                + "- Educational and appropriate for all ages\n"
                + "- Simple background, focus on the main subject\n"
                + "- High quality, professional illustration\n\n"
                + "Return ONLY a JSON object with this exact structure:\n"
                + "{\n"
                + "  \"enhanced_prompt\": \"detailed cartoon-style prompt for image generation\",\n"
                + "  \"style\": \"cartoon/animated illustration style description\",\n"
                + "  \"quality_tags\": [\"cute\", \"colorful\", \"friendly\", \"educational\", \"child-friendly\"],\n"
                + "  \"background\": \"simple background description\",\n"
                + "  \"mood\": \"cheerful and welcoming\"\n"
                + "}\n\n"
                + "Example: If input is 'cat', output should describe a cute cartoon cat with big eyes, friendly smile, bright colors, simple background.\n\n"
                + "User vocabulary/prompt: " + userPrompt;
        
        part.addProperty("text", systemPrompt);
        parts.add(part);
        content.add("parts", parts);
        contents.add(content);
        requestBody.add("contents", contents);
        
        // Make HTTP request
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        
        // Send request
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = gson.toJson(requestBody).getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        
        // Read response
        int responseCode = conn.getResponseCode();
        logger.info("Gemini API response code: {}", responseCode);
        
        if (responseCode == HttpURLConnection.HTTP_OK) {
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder response = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
                
                String responseText = response.toString();
                logger.info("Gemini API response: {}", responseText);
                
                // Parse response to get enhanced prompt
                JsonObject responseJson = gson.fromJson(responseText, JsonObject.class);
                if (responseJson.has("candidates")) {
                    JsonArray candidates = responseJson.getAsJsonArray("candidates");
                    if (candidates.size() > 0) {
                        JsonObject candidate = candidates.get(0).getAsJsonObject();
                        JsonObject contentObj = candidate.getAsJsonObject("content");
                        JsonArray partsArray = contentObj.getAsJsonArray("parts");
                        if (partsArray.size() > 0) {
                            String text = partsArray.get(0).getAsJsonObject().get("text").getAsString();
                            return text;
                        }
                    }
                }
                
                return responseText;
            }
        } else {
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8))) {
                StringBuilder errorResponse = new StringBuilder();
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    errorResponse.append(responseLine.trim());
                }
                logger.error("Gemini API error: {}", errorResponse.toString());
                throw new Exception("Gemini API error: " + errorResponse.toString());
            }
        }
    }
}
