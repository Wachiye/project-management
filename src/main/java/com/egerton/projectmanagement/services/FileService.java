package com.egerton.projectmanagement.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
public class FileService{

    @Value(value="cloudinary.api_key")
    private String API_KEY;
    @Value(value="cloudinary.api_secret")
    private String API_SECRET;
    @Value(value="cloudinary.cloud_name")
    private String CLOUD_NAME;

    private Cloudinary cloudinary() {
        Cloudinary cloudinary = null;
        Map config = new HashMap();
        config.put("cloud_name", CLOUD_NAME);
        config.put("api_key", API_KEY);
        config.put("api_secret", API_SECRET);
        cloudinary = new Cloudinary(config);
        return cloudinary;
    }

    public String upload(MultipartFile multipartFile, String filename) {
        try{
            File file = convertToFile( multipartFile, filename);
            if(file != null){
                Map uploadResult = cloudinary().uploader().upload(file,
                        ObjectUtils.asMap("resource_type", "raw"));
                return  uploadResult.get("url").toString();
            }
            file.delete();
            return null;
        } catch (Exception ex){
            ex.printStackTrace();
            return null;
        }
    }

    public ByteArrayResource load(String fileURL) {
        if(fileURL == null)
            return null;
        try{
            // Get a ByteArrayResource from the URL
            URL url = new URL(fileURL);
            InputStream inputStream = url.openStream();
            byte[] out = inputStream.readAllBytes();
            return new ByteArrayResource(out);
        } catch (Exception exception){
            return null;
        }
    }

    //convert to file
    private File convertToFile(MultipartFile multipartFile, String filename){
        try{
            File convFile = new File(filename);
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(multipartFile.getBytes());
            fos.close();
            return convFile;
        } catch (Exception exception){
            exception.printStackTrace();
            return null;
        }
    }
}
