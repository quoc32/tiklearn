package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import qdtt.tiklearn.entity.Gift;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {
}
