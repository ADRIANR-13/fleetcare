package com.example.demo.controller;

import com.example.demo.dto.CostoPorVehiculo;
import com.example.demo.dto.FallasPorVehiculo;
import com.example.demo.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final DashboardService service;

    public ReporteController(DashboardService service) { this.service = service; }

    @GetMapping("/costos")
    public List<CostoPorVehiculo> costos() { return service.costosPorVehiculo(); }

    @GetMapping("/fallas")
    public List<FallasPorVehiculo> fallas() { return service.fallasPorVehiculo(); }
}