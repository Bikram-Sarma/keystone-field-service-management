package com.keystone.backend.service;

import com.keystone.backend.entity.Technician;
import com.keystone.backend.repository.TechnicianRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TechnicianService {

    private final TechnicianRepository technicianRepository;

    public TechnicianService(TechnicianRepository technicianRepository) {
        this.technicianRepository = technicianRepository;
    }

    // Create technician
    public Technician createTechnician(Technician technician) {
        return technicianRepository.save(technician);
    }

    // Get all technicians
    public List<Technician> getAllTechnicians() {
        return technicianRepository.findAll();
    }

    // Get technician by ID
    public Technician getTechnicianById(Long id) {
        return technicianRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Technician not found with id: " + id
                        )
                );
    }

    // Update technician
    public Technician updateTechnician(
            Long id,
            Technician updatedTechnician
    ) {

        Technician technician = getTechnicianById(id);

        technician.setName(updatedTechnician.getName());
        technician.setEmail(updatedTechnician.getEmail());
        technician.setPhone(updatedTechnician.getPhone());
        technician.setSpecialization(
                updatedTechnician.getSpecialization()
        );
        technician.setActive(updatedTechnician.getActive());

        return technicianRepository.save(technician);
    }
}