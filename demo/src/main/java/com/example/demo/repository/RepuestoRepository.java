package com.example.demo.repository;

import com.example.demo.model.Repuesto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepuestoRepository extends JpaRepository<Repuesto, Long> {}