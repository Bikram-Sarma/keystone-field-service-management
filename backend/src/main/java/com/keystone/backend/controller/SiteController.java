package com.keystone.backend.controller;

import com.keystone.backend.entity.Site;
import com.keystone.backend.service.SiteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    // Create a site for a customer
    @PostMapping("/customers/{customerId}/sites")
    public ResponseEntity<Site> createSite(
            @PathVariable Long customerId,
            @RequestBody Site site
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(siteService.createSite(customerId, site));
    }

    // Get all sites for a customer
    @GetMapping("/customers/{customerId}/sites")
    public ResponseEntity<List<Site>> getSitesByCustomerId(
            @PathVariable Long customerId
    ) {
        return ResponseEntity.ok(
                siteService.getSitesByCustomerId(customerId)
        );
    }

    // Get site by ID
    @GetMapping("/sites/{id}")
    public ResponseEntity<Site> getSiteById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                siteService.getSiteById(id)
        );
    }

    // Update site
    @PutMapping("/sites/{id}")
    public ResponseEntity<Site> updateSite(
            @PathVariable Long id,
            @RequestBody Site site
    ) {
        return ResponseEntity.ok(
                siteService.updateSite(id, site)
        );
    }

    // Delete site
    @DeleteMapping("/sites/{id}")
    public ResponseEntity<Void> deleteSite(
            @PathVariable Long id
    ) {
        siteService.deleteSite(id);

        return ResponseEntity.noContent().build();
    }
}