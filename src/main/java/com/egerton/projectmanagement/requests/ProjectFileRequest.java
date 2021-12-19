package com.egerton.projectmanagement.requests;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Data
public class ProjectFileRequest {

    @NotBlank(message = "Missing field. File name is required.")
    private String name;

    @NotBlank(message = "Missing field. File description is required.")
    private String description;

    @NotNull(message = "Missing field. File is required.")
    private MultipartFile file;

    @NotBlank( message = "Missing Field. Project File type is required")
    private String fileType;

    @NotNull(message = "Missing field. Project ID is required.")
    private long projectId;

    @NotNull(message = "Missing field. Student ID is required.")
    private long studentId;

}
