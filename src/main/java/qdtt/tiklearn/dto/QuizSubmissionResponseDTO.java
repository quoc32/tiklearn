package qdtt.tiklearn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmissionResponseDTO {
    private int correct;
    private int total;
    private List<Long> missedWordIds;
}
