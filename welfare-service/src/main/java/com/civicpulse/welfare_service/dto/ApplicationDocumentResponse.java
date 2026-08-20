package com.civicpulse.welfare_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationDocumentResponse {

    private Long id;

    private String documentName;

    private String fileName;

    private String fileType;

    private String filePath;
}