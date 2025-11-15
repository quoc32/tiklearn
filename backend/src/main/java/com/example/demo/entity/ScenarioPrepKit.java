package qdtt.tiklearn.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "scenario_prep_kit", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"scenario_id", "vocabulary_id"})
})
public class ScenarioPrepKit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    @ManyToOne
    @JoinColumn(name = "vocabulary_id", nullable = false)
    private Vocabulary vocabulary;
}
