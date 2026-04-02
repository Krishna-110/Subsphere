package com.tech.subsphere.corefeature;

import lombok.Data;

@Data // Lombok automatically generates getters and setters for these fields
public class InterviewRequest {
    private String resume;
    private String jobDescription;
}