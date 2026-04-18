package com1.Travel_mate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com1.Travel_mate.model.Travel_mateModel;

public interface UserRepository extends JpaRepository<Travel_mateModel.User, Integer> {
    Travel_mateModel.User findByEmail(String email);
}