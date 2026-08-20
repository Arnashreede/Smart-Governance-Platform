package com.civicpulse.citizen_service.controller;

import com.civicpulse.citizen_service.entity.Citizen;
import com.civicpulse.citizen_service.service.CitizenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;
import com.civicpulse.citizen_service.dto.CitizenResponse;
@RestController
@RequestMapping("/citizens")

public class CitizenController {


    @Autowired
    private CitizenService citizenService;

    @GetMapping
public List<CitizenResponse> getAllCitizens() {
    System.out.println("GET endpoint called");

    return citizenService.getAllCitizens()
            .stream()
            .map(citizen -> new CitizenResponse(
                    citizen.getId(),
                    citizen.getFullName(),
                    citizen.getEmail(),
                    citizen.getPhone(),
                    citizen.getAddress(),
                    citizen.getAadhaarNumber()
            ))
            .toList();
}
@PostMapping
public CitizenResponse addCitizen(@Valid @RequestBody Citizen citizen) {

    System.out.println("POST endpoint called");

    Citizen savedCitizen = citizenService.saveCitizen(citizen);

    return new CitizenResponse(
            savedCitizen.getId(),
            savedCitizen.getFullName(),
            savedCitizen.getEmail(),
            savedCitizen.getPhone(),
            savedCitizen.getAddress(),
            savedCitizen.getAadhaarNumber()
    );
}
    @GetMapping("/{id}")
public CitizenResponse getCitizen(@PathVariable Long id) {

    Citizen citizen = citizenService.getCitizenById(id);

    return new CitizenResponse(
            citizen.getId(),
            citizen.getFullName(),
            citizen.getEmail(),
            citizen.getPhone(),
            citizen.getAddress(),
            citizen.getAadhaarNumber()
    );
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