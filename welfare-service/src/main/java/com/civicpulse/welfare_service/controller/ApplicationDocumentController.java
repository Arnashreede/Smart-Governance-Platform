package com.civicpulse.welfare_service.controller;

import com.civicpulse.welfare_service.entity.ApplicationDocument;
import com.civicpulse.welfare_service.repository.ApplicationDocumentRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class ApplicationDocumentController {

    private final ApplicationDocumentRepository repository;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long id) {

        ApplicationDocument document =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found"
                                )
                        );

        System.out.println("================================");
        System.out.println(
                "ID = " + document.getId()
        );
        System.out.println(
                "Document Name = " +
                document.getDocumentName()
        );
        System.out.println(
                "Document Path = " +
                document.getFilePath()
        );
        System.out.println(
                "Document Type = " +
                document.getFileType()
        );
        System.out.println("================================");

        if (document.getFilePath() == null ||
                document.getFilePath().isBlank()) {

            throw new RuntimeException(
                    "DOCUMENT PATH IS NULL"
            );
        }

        File file =
                new File(document.getFilePath());

        if (!file.exists()) {

            throw new RuntimeException(
                    "FILE NOT FOUND : " +
                    file.getAbsolutePath()
            );
        }

        Resource resource =
                new FileSystemResource(file);

        /*
         * Determine the correct MIME type.
         *
         * Examples:
         * .webp  -> image/webp
         * .jpg   -> image/jpeg
         * .png   -> image/png
         * .pdf   -> application/pdf
         */
        MediaType mediaType =
                MediaTypeFactory
                        .getMediaType(file.getName())
                        .orElse(
                                MediaType.APPLICATION_OCTET_STREAM
                        );

        System.out.println(
                "Detected Content-Type = " +
                mediaType
        );

        return ResponseEntity.ok()

                // Tell browser what kind of file this is
                .contentType(mediaType)

                // Display in browser instead of forcing download
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                        document.getDocumentName() +
                        "\""
                )

                .body(resource);
    }
}