package qdtt.tiklearn.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "interaction_nodes")
public class InteractionNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario; // Thuộc tình huống nào

    @Column(name = "video_path", nullable = false)
    private String videoPath; // Video POV (video gốc hoặc video nhánh)

    @Column(name = "prompt_text", length = 1000)
    private String promptText; // Lời thoại của nhân vật (ví dụ: "Giá là 50.000 đồng.")

    // Đánh dấu đây có phải là video bắt đầu của kịch bản không
    @Column(name = "is_starting_node", nullable = false)
    private boolean isStartingNode = false;

    // Một node (video) có nhiều lựa chọn (choice) đi ra
    @OneToMany(mappedBy = "sourceNode", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InteractionChoice> choices;
}
