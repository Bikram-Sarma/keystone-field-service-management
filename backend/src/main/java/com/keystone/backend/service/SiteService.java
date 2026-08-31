package com.keystone.backend.service;

import com.keystone.backend.entity.Customer;
import com.keystone.backend.entity.Site;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.SiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SiteService {

    private final SiteRepository siteRepository;
    private final CustomerRepository customerRepository;

    public SiteService(
            SiteRepository siteRepository,
            CustomerRepository customerRepository
    ) {
        this.siteRepository = siteRepository;
        this.customerRepository = customerRepository;
    }

    // =========================================================
    // CREATE SITE
    // =========================================================

    public Site createSite(Long customerId, Site site) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found with id: " + customerId
                        )
                );

        site.setCustomer(customer);

        return siteRepository.save(site);
    }

    // =========================================================
    // GET SITES BY CUSTOMER
    // =========================================================

    public List<Site> getSitesByCustomerId(Long customerId) {

        customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found with id: " + customerId
                        )
                );

        return siteRepository.findByCustomerId(customerId);
    }

    // =========================================================
    // GET SITE BY ID
    // =========================================================

    public Site getSiteById(Long id) {

        return siteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Site not found with id: " + id
                        )
                );
    }

    // =========================================================
    // UPDATE SITE
    // =========================================================

    public Site updateSite(Long id, Site updatedSite) {

        Site site = getSiteById(id);

        site.setName(updatedSite.getName());
        site.setAddress(updatedSite.getAddress());
        site.setCity(updatedSite.getCity());
        site.setState(updatedSite.getState());
        site.setPostalCode(updatedSite.getPostalCode());

        return siteRepository.save(site);
    }

    // =========================================================
    // DELETE SITE
    // =========================================================

    public void deleteSite(Long id) {

        Site site = siteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Site not found with id: " + id
                        )
                );

        siteRepository.deleteById(id);
    }
}