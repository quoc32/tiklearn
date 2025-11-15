package qdtt.tiklearn.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FlashcardDTO {

    private Long id; // ID của từ vựng
    private String word;
    private String partOfSpeech;
    private String pronunciation;
    private String meaning;
    private String exampleSentence;

}
