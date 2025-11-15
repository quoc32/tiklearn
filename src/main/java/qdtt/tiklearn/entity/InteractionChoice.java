package qdtt.tiklearn.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "interaction_choices")
public class InteractionChoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lựa chọn này thuộc về Node (video) nào
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_node_id", nullable = false)
    private InteractionNode sourceNode;

    @Column(name = "choice_text", nullable = false)
    private String choiceText; // Ví dụ: "[A. Mặc cả]"

    // QUAN TRỌNG: Khi chọn, sẽ nhảy đến Node (video) nào tiếp theo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_node_id", nullable = true) // 'nullable = true' vì lựa chọn cuối cùng sẽ không có next_node
    private InteractionNode nextNode;
}
