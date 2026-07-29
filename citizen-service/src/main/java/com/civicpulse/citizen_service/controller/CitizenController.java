package com.civicpulse.citizen_service.controller;

import com.civicpulse.citizen_service.entity.Citizen;
import com.civicpulse.citizen_service.service.CitizenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/citizens")

public class CitizenController {


    @Autowired
    private CitizenService citizenService;

    @GetMapping
public List<Citizen> getAllCitizens() {
    System.out.println("GET endpoint called");
    return citizenService.getAllCitizens();
}
@PostMapping
public Citizen addCitizen(@Valid @RequestBody Citizen citizen) {
    System.out.println("POST endpoint called");
    return citizenService.saveCitizen(citizen);
}

    @GetMapping("/{id}")
    public Citizen getCitizen(@PathVariable Long id) {
        return citizenService.getCitizenById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteCitizen(@PathVariable Long id) {
        citizenService.deleteCitizen(id);
        return "Citizen deleted successfully";
    }
    @GetMapping("/dashboard/count")
public long getTotalCitizens() {
    return citizenService.getTotalCitizens();
}
}