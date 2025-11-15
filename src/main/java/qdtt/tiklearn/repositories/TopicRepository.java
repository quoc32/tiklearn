package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import qdtt.tiklearn.entity.Topic;

public interface TopicRepository extends JpaRepository<Topic, Long> {}
