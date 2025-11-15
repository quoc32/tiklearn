package qdtt.tiklearn.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import qdtt.tiklearn.dto.FlashcardDTO;
import qdtt.tiklearn.dto.InteractionChoiceDTO;
import qdtt.tiklearn.dto.InteractionNodeDTO;
import qdtt.tiklearn.dto.ScenarioDTO;
import qdtt.tiklearn.entity.*;
import qdtt.tiklearn.repositories.InteractionChoiceRepository;
import qdtt.tiklearn.repositories.InteractionNodeRepository;
import qdtt.tiklearn.repositories.ScenarioPrepKitRepository;
import qdtt.tiklearn.repositories.ScenarioRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScenarioService {

    @Autowired
    private ScenarioRepository scenarioRepo;
    @Autowired private ScenarioPrepKitRepository prepKitRepo;
    @Autowired private InteractionNodeRepository nodeRepo;
    @Autowired private InteractionChoiceRepository choiceRepo;

    // API 1: Lấy tất cả các kịch bản
    @Transactional(readOnly = true)
    public List<ScenarioDTO> getAllScenarios() {
        return scenarioRepo.findAll().stream()
                .map(this::mapToScenarioDTO)
                .collect(Collectors.toList());
    }

    // API 2: Lấy bộ Prep-Kit (Flashcards) [cite: 25]
    @Transactional(readOnly = true)
    public List<FlashcardDTO> getPrepKit(Long scenarioId) {
        // Đảm bảo kịch bản tồn tại
        if (!scenarioRepo.existsById(scenarioId)) {
            throw new RuntimeException("Không tìm thấy kịch bản: " + scenarioId);
        }

        List<ScenarioPrepKit> prepKitItems = prepKitRepo.findByScenario_Id(scenarioId);

        return prepKitItems.stream()
                .map(item -> mapToFlashcardDTO(item.getVocabulary()))
                .collect(Collectors.toList());
    }

    // API 3: Lấy video/node BẮT ĐẦU [cite: 33-34]
    @Transactional(readOnly = true)
    public InteractionNodeDTO getStartingNode(Long scenarioId) {
        InteractionNode node = nodeRepo.findByScenario_IdAndIsStartingNodeTrue(scenarioId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy node bắt đầu cho kịch bản: " + scenarioId));
        return mapToNodeDTO(node);
    }

    // API 4: Lấy video/node TIẾP THEO dựa trên lựa chọn [cite: 38]
    @Transactional(readOnly = true)
    public InteractionNodeDTO getNextNode(Long choiceId) {
        InteractionChoice choice = choiceRepo.findById(choiceId)
                .orElseThrow(() -> new RuntimeException("Lựa chọn không hợp lệ: " + choiceId));

        InteractionNode nextNode = choice.getNextNode();

        if (nextNode == null) {
            // Đây là lựa chọn cuối cùng, kết thúc hội thoại
            return null;
        }

        return mapToNodeDTO(nextNode);
    }

    // --- CÁC HÀM HELPER ĐỂ MAP DỮ LIỆU ---

    private ScenarioDTO mapToScenarioDTO(Scenario scenario) {
        ScenarioDTO dto = new ScenarioDTO();
        dto.setId(scenario.getId());
        dto.setName(scenario.getName());
        dto.setDescription(scenario.getDescription());
        dto.setIcon(scenario.getIcon());
        return dto;
    }

    private FlashcardDTO mapToFlashcardDTO(Vocabulary vocab) {
        FlashcardDTO dto = new FlashcardDTO();
        dto.setId(vocab.getId());
        dto.setWord(vocab.getWord());
        dto.setPartOfSpeech(vocab.getPartOfSpeech());
        dto.setPronunciation(vocab.getPronunciation());
        dto.setMeaning(vocab.getDefinition());
        dto.setExampleSentence(vocab.getExampleSentence());
        // dto.setImagePath(vocab.getImagePath()); // Sẽ cần khi bạn thêm ảnh
        return dto;
    }

    private InteractionNodeDTO mapToNodeDTO(InteractionNode node) {
        InteractionNodeDTO dto = new InteractionNodeDTO();
        dto.setId(node.getId());
        dto.setVideoPath(node.getVideoPath());
        dto.setPromptText(node.getPromptText());

        // Map các lựa chọn của node này sang DTO
        List<InteractionChoiceDTO> choiceDTOs = node.getChoices().stream()
                .map(this::mapToChoiceDTO)
                .collect(Collectors.toList());

        dto.setChoices(choiceDTOs);
        return dto;
    }

    private InteractionChoiceDTO mapToChoiceDTO(InteractionChoice choice) {
        InteractionChoiceDTO dto = new InteractionChoiceDTO();
        dto.setId(choice.getId());
        dto.setChoiceText(choice.getChoiceText());
        return dto;
    }
}
