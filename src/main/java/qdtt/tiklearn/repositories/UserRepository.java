package qdtt.tiklearn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import qdtt.tiklearn.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {}
