package com.springjwt.spring.OCRProject.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springjwt.spring.OCRProject.exception.FileNotSupportedException;
import com.springjwt.spring.OCRProject.model.FileDetails;
import com.springjwt.spring.OCRProject.payload.FileUploadResponse;
import com.springjwt.spring.OCRProject.service.FileUploadService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "file")
@CrossOrigin(/*origins = "http://localhost:3000"*/ origins = "*" ,maxAge = 3600)
public class FileUploadController {

  @Autowired
  private FileUploadService fileUploadService;
  @GetMapping()
  @PreAuthorize("hasRole('ADMIN')")
  @ResponseStatus(code = HttpStatus.OK)
  public List<FileDetails> getAllFiles() {
    return this.fileUploadService.getAllFiles();
  }

  @GetMapping("/uploader/{uploaderId}")
  @PreAuthorize("hasRole('USER') ")
  public ResponseEntity<Object> getAllFilesByUploaderId(@PathVariable String uploaderId) {
    try {
      List<FileDetails> files = this.fileUploadService.getAllFilesByUploaderId(uploaderId);
      return new ResponseEntity<>(files, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @PostMapping(value = "/upload")
  public ResponseEntity<Object> uploadFiles(@RequestParam("name") String name
          , @RequestParam("files") MultipartFile[] files, @RequestParam("uploader_Id") String uploader_Id) {

    try {
      List<FileUploadResponse> fileUploadResponses =
              Arrays.stream(files).map(file -> {
                try {
                  return fileUploadService.uploadFile(file, name, uploader_Id);
                } catch (IOException e) {
                  throw new UncheckedIOException(e);
                }
              }).collect(Collectors.toList());

      return new ResponseEntity<>(fileUploadResponses, HttpStatus.OK);
    } catch (UncheckedIOException e) {
      return new ResponseEntity<>(e.getMessage(),
              HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (FileNotSupportedException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }


  @GetMapping("/download/{fileName:.+}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
  public ResponseEntity<Object> downloadFile(@PathVariable String fileName,
                                             HttpServletRequest request) {

    try {
      Resource resource = this.fileUploadService.fetchFileAsResource(fileName);
      String contentType =
              request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());

      if (contentType == null) {
        contentType = "application/octet-stream";
      }

      return ResponseEntity.ok()
              .contentType(MediaType.parseMediaType(contentType))
              .header(HttpHeaders.CONTENT_DISPOSITION,
                      "attachment; filename=\"" + resource.getFilename() + "\"")
              .body(resource);
    } catch (IOException ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
  }
}
