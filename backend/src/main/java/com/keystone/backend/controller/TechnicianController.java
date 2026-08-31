package com.keystone.backend.controller;

import com.keystone.backend.entity.Technician;
import com.keystone.backend.service.TechnicianService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    private final TechnicianService technicianService;

    public TechnicianController(
            TechnicianService technicianService
    ) {
        this.technicianService = technicianService;
    }

    // Create technician
    @PostMapping
    public ResponseEntity<Technician> createTechnician(
            @RequestBody Technician technician
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        technicianService.createTechnician(
                                technician
                        )
                );
    }

    // Get all technicians
    @GetMapping
    public ResponseEntity<List<Technician>> getAllTechnicians() {
        return ResponseEntity.ok(
                technicianService.getAllTechnicians()
        );
    }

    // Get technician by ID
    @GetMapping("/{id}")
    public ResponseEntity<Technician> getTechnicianById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                technicianService.getTechnicianById(id)
        );
    }

    // Update technician
    @PutMapping("/{id}")
    public ResponseEntity<Technician> updateTechnician(
            @PathVariable Long id,
            @RequestBody Technician technician
    ) {
        return ResponseEntity.ok(
                technicianService.updateTechnician(
                        id,
                        technician
                )
        );
    }
}