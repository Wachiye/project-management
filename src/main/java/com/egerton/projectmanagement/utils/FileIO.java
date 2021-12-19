package com.egerton.projectmanagement.utils;

import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

public class FileIO {

    public static boolean upload(MultipartFile file, String filename){
        try{
            File convertFile = new File("/uploads/"+ filename);
            convertFile.createNewFile();
            FileOutputStream outputStream = new FileOutputStream(convertFile);
            outputStream.write(file.getBytes());
            outputStream.close();
            return true;
        } catch (Exception ex){
            ex.printStackTrace();
            return false;
        }
    }

    public static InputStreamResource download(String filename){
        try{
            File file = new File(filename);
            return new InputStreamResource(new FileInputStream(file));
        } catch (Exception ex){
            ex.printStackTrace();
            return null;
        }
    }
}
