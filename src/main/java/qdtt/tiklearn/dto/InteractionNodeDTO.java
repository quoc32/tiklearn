package qdtt.tiklearn.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class InteractionNodeDTO {

    private Long id; // ID của node (video)
    private String videoPath;
    private String promptText; // Lời thoại
    private List<InteractionChoiceDTO> choices; // Danh sách các lựa chọn
}
