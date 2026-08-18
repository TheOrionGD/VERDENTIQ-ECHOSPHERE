package com.verdantiq.gateway.common;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
public class MinioService {

    @Autowired
    private MinioClient minioClient;

    private static final String DEFAULT_BUCKET = "verdantiq-evidence";

    public String uploadEvidence(MultipartFile file) throws Exception {
        boolean isExist = minioClient.bucketExists(BucketExistsArgs.builder().bucket(DEFAULT_BUCKET).build());
        if (!isExist) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(DEFAULT_BUCKET).build());
        }

        String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        InputStream inputStream = file.getInputStream();
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(DEFAULT_BUCKET)
                        .object(fileName)
                        .stream(inputStream, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        return "minio://" + DEFAULT_BUCKET + "/" + fileName;
    }
}
