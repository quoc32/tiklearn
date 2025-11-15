package qdtt.tiklearn.services;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import qdtt.tiklearn.entity.Vocabulary;
import qdtt.tiklearn.repositories.VocabularyRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class VocabularyService {

    @Autowired
    private VocabularyRepository vocabularyRepository;

    private static final String GEMINI_API_KEY = "AIzaSyD6azrs5YuxSKDsU2Xa9k5G5eZ6a3g6XIA";
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent";

    public List<Vocabulary> generateVocabulariesForTopic(String topic, int count) throws Exception {
        String prompt = String.format(
            "Generate exactly %d English vocabulary words related to the topic '%s'. " +
            "For each word, provide: the word itself, a clear definition, and an example sentence. " +
            "Format the response as a JSON array with objects containing 'word', 'definition', and 'exampleSentence' fields. " +
            "Response must be valid JSON only, no additional text.",
            count, topic
        );

        String responseText = callGeminiAPI(prompt);
        List<Vocabulary> vocabularies = parseVocabularies(responseText, topic);
        vocabularyRepository.saveAll(vocabularies);
        
        return vocabularies;
    }

    public List<Vocabulary> generateVocabulariesForAllTopics(List<String> topics, int countPerTopic) throws Exception {
        List<Vocabulary> allVocabularies = new ArrayList<>();
        
        for (String topic : topics) {
            try {
                List<Vocabulary> topicVocabs = generateVocabulariesForTopic(topic, countPerTopic);
                allVocabularies.addAll(topicVocabs);
                Thread.sleep(3000); // 3 seconds delay
            } catch (Exception e) {
                System.err.println("Error for topic " + topic + ": " + e.getMessage());
            }
        }
        
        return allVocabularies;
    }

    private String callGeminiAPI(String prompt) throws Exception {
        URL url = new URL(GEMINI_API_URL + "?key=" + GEMINI_API_KEY);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        // Build request body theo format mới
        JsonObject requestBody = new JsonObject();
        JsonArray contents = new JsonArray();
        
        JsonObject content = new JsonObject();
        JsonArray parts = new JsonArray();
        
        JsonObject textPart = new JsonObject();
        textPart.addProperty("text", prompt);
        parts.add(textPart);
        
        content.add("parts", parts);
        contents.add(content);
        requestBody.add("contents", contents);

        // Send request
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestBody.toString().getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        // Read response
        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            throw new Exception("Gemini API error code: " + responseCode);
        }

        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
        }

        // Parse response
        Gson gson = new Gson();
        JsonObject jsonResponse = gson.fromJson(response.toString(), JsonObject.class);
        
        if (!jsonResponse.has("candidates")) {
            throw new Exception("Invalid response from Gemini API");
        }
        
        JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
        if (candidates.size() == 0) {
            throw new Exception("No candidates in response");
        }
        
        JsonObject candidate = candidates.get(0).getAsJsonObject();
        JsonObject contentObj = candidate.getAsJsonObject("content");
        JsonArray partsArray = contentObj.getAsJsonArray("parts");
        
        if (partsArray.size() == 0) {
            throw new Exception("No parts in response");
        }
        
        return partsArray.get(0).getAsJsonObject().get("text").getAsString();
    }

    private List<Vocabulary> parseVocabularies(String responseText, String topic) throws Exception {
        List<Vocabulary> vocabularies = new ArrayList<>();
        Gson gson = new Gson();

        String cleanedText = responseText.trim();
        if (cleanedText.startsWith("```json")) cleanedText = cleanedText.substring(7);
        if (cleanedText.startsWith("```")) cleanedText = cleanedText.substring(3);
        if (cleanedText.endsWith("```")) cleanedText = cleanedText.substring(0, cleanedText.length() - 3);
        cleanedText = cleanedText.trim();

        JsonArray vocabArray = gson.fromJson(cleanedText, JsonArray.class);
        
        for (int i = 0; i < vocabArray.size(); i++) {
            JsonObject vocabObj = vocabArray.get(i).getAsJsonObject();
            String word = vocabObj.has("word") ? vocabObj.get("word").getAsString() : "";
            String definition = vocabObj.has("definition") ? vocabObj.get("definition").getAsString() : "";
            String exampleSentence = vocabObj.has("exampleSentence") ? vocabObj.get("exampleSentence").getAsString() : "";
            
            if (!word.isEmpty()) {
                vocabularies.add(new Vocabulary(word, definition, exampleSentence, topic));
            }
        }

        return vocabularies;
    }

    public List<Vocabulary> getAllVocabularies() {
        return vocabularyRepository.findAll();
    }

    public List<Vocabulary> getVocabulariesByTopic(String topic) {
        return vocabularyRepository.findByTopic(topic);
    }

    public void deleteVocabulary(Long id) {
        vocabularyRepository.deleteById(id);
    }
}
