package qdtt.tiklearn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultDTO {
    private Long vocabularyId;
    private boolean correct;

    // Lombok sẽ tự tạo getter isCorrect() cho boolean field
    // Nhưng để đảm bảo tương thích, ta có thể thêm method alias
    public boolean isCorrect() {
        return correct;
    }

    public void setIsCorrect(boolean correct) {
        this.correct = correct;
    }
}
