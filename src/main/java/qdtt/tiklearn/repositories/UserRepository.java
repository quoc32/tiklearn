package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import qdtt.tiklearn.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
