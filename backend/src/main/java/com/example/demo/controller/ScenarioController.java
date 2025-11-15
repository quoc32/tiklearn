package qdtt.tiklearn.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import qdtt.tiklearn.dto.FlashcardDTO;
import qdtt.tiklearn.dto.InteractionNodeDTO;
import qdtt.tiklearn.dto.ScenarioDTO;
import qdtt.tiklearn.services.ScenarioService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scenarios") // URL chung cho Module 2
@CrossOrigin(origins = "http://localhost:5173")
public class ScenarioController {

    @Autowired
    private ScenarioService scenarioService;

    /**
     * API 1: Lấy tất cả các kịch bản (tình huống)
     * GET /api/v1/scenarios
     */
    @GetMapping
    public ResponseEntity<List<ScenarioDTO>> getAllScenarios() {
        return ResponseEntity.ok(scenarioService.getAllScenarios());
    }

    /**
     * API 2: Lấy bộ Prep-Kit (Flashcards) cho một kịch bản
     * GET /api/v1/scenarios/{id}/prep-kit
     */
    @GetMapping("/{id}/prep-kit")
    public ResponseEntity<List<FlashcardDTO>> getPrepKit(@PathVariable Long id) {
        return ResponseEntity.ok(scenarioService.getPrepKit(id));
    }

    /**
     * API 3: Lấy video/node bắt đầu của một kịch bản
     * GET /api/v1/scenarios/{id}/start
     */
    @GetMapping("/{id}/start")
    public ResponseEntity<InteractionNodeDTO> getStartingPracticeNode(@PathVariable Long id) {
        return ResponseEntity.ok(scenarioService.getStartingNode(id));
    }

    /**
     * API 4: Lấy video/node tiếp theo dựa trên lựa chọn của người dùng
     * GET /api/v1/scenarios/choice/{choiceId}
     */
    @GetMapping("/choice/{choiceId}")
    public ResponseEntity<InteractionNodeDTO> getNextNode(@PathVariable Long choiceId) {
        InteractionNodeDTO nextNode = scenarioService.getNextNode(choiceId);

        if (nextNode == null) {
            // Đã kết thúc hội thoại, trả về "No Content"
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(nextNode);
    }
}
