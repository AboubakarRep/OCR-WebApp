package com.springjwt.spring.OCRProject.service;

import com.springjwt.spring.OCRProject.model.FileDetails;
import com.springjwt.spring.OCRProject.payload.FileUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

public interface FileUploadService {

  public FileUploadResponse uploadFile(MultipartFile file,
                                       String uploaderName, String uploader_Id) throws IOException;

  public Resource fetchFileAsResource(String fileName) throws FileNotFoundException;

  public List<FileDetails> getAllFiles();

  public List<FileDetails> getAllFilesByUploaderId(String uploaderId);
}
