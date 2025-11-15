package qdtt.tiklearn.dto;

import lombok.Data;

@Data
public class LearningFlowDTO {
    private Long id; // vocabId
    private String word;
    private String partOfSpeech;
    private String pronunciation;
    private String meaning; // (definition)
    private String exampleSentence;
    private String videoUrl;
    private String status; // NOT_LEARNED
}
