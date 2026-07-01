package com.tech.subsphere.corefeature;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class PdfService {

    public String extractTextFromPdf(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return "Error: File is empty";
        }

        try (InputStream inputStream = file.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {
            
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            
            return text != null ? text.trim() : "";
        } catch (Exception e) {
            System.err.println("PDF Extraction Error: " + e.getMessage());
            return "Error extracting text: " + e.getMessage();
        }
    }
}
