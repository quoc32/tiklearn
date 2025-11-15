package qdtt.tiklearn.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ScenarioDTO {

    private Long id;
    private String name;
    private String description;
    private String icon;
}