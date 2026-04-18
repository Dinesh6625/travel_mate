package com1.Travel_mate.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com1.Travel_mate.model.Travel_mateModel;

public interface BookingRepository extends JpaRepository<Travel_mateModel.Booking, Integer> {
}