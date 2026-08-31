package com.keystone.backend.service;

import com.keystone.backend.entity.Customer;
import com.keystone.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Create customer
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with id: " + id)
                );
    }

    // Update customer
    public Customer updateCustomer(Long id, Customer updatedCustomer) {

        Customer customer = getCustomerById(id);

        customer.setName(updatedCustomer.getName());
        customer.setContactEmail(updatedCustomer.getContactEmail());
        customer.setPhone(updatedCustomer.getPhone());
        customer.setActive(updatedCustomer.getActive());

        return customerRepository.save(customer);
    }

    // Delete customer
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}