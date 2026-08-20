package com.civicpulse.welfare_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "document_path")
    private String filePath;

    @Column(name = "document_type")
    private String fileType;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private WelfareApplication application;
}