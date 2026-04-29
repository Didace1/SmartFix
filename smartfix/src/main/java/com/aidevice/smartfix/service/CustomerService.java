package com.aidevice.smartfix.service;

import com.aidevice.smartfix.model.Customer;
import com.aidevice.smartfix.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getById(Long id) {
        return customerRepository.findById(id);
    }

    public Optional<Customer> getByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public Optional<Customer> getByPhone(String phone) {
        return customerRepository.findByPhone(phone);
    }

    public List<Customer> search(String query) {
        return customerRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }

    @Transactional
    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer update(Long id, Customer updated) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        customer.setFirstName(updated.getFirstName());
        customer.setLastName(updated.getLastName());
        customer.setEmail(updated.getEmail());
        customer.setPhone(updated.getPhone());
        customer.setAddress(updated.getAddress());
        customer.setNationalId(updated.getNationalId());
        customer.setCustomerType(updated.getCustomerType());
        return customerRepository.save(customer);
    }

    @Transactional
    public void delete(Long id) {
        customerRepository.deleteById(id);
    }
}
