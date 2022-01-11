package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Setting;
import com.egerton.projectmanagement.models.SettingCategory;
import com.egerton.projectmanagement.repositories.SettingRepository;
import com.egerton.projectmanagement.requests.SettingRequest;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingController {
    @Autowired
    private SettingRepository settingRepository;

    @GetMapping
    public ResponseEntity<Object> getSettings() {
        try {
            List<Setting> settings = new ArrayList<>();;
            settingRepository.findAll().forEach(settings::add);
            if (settings.isEmpty()) { // no settings found
                return ResponseHandler.generateResponse(
                        "No setting record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    settings
            );
        }catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<Object> getSettingsByYear(@PathVariable int year) {
        try {
            List<Setting> settings = new ArrayList<>();
            System.out.println();
            settingRepository.findAllByYear(year).forEach(settings::add);
            if (settings.isEmpty()) { // no settings found
                return ResponseHandler.generateResponse(
                        "No setting record was found for year:" + year,
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    settings
            );
        }catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    @PostMapping
    public ResponseEntity<Object> createSetting(@RequestBody SettingRequest requestData){
        try{
            SettingCategory category = SettingCategory.valueOf( requestData.getCategory());
            Optional<Setting> optionalSetting = settingRepository.findSettingByYearAndCategory(requestData.getYear(),  category);

            if(optionalSetting.isPresent()){
                return ResponseHandler.generateResponse(
                        "Error. Setting for " + category + " Submission for year " + requestData.getYear() + " already exists.",
                        HttpStatus.BAD_REQUEST,
                        null
                );
            }

            Setting setting = new Setting();
            populateSetting( setting, requestData);
            Setting _setting = settingRepository.save( setting);

            return ResponseHandler.generateResponse(
                    "Setting was saved successful.",
                    HttpStatus.OK,
                    _setting
            );
        }catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> createSetting(@PathVariable long id, @RequestBody SettingRequest requestData){
        try{
            SettingCategory category = SettingCategory.valueOf( requestData.getCategory());
            Optional<Setting> optionalSetting = settingRepository.findById( id);

            if(optionalSetting.isPresent()){
                Setting setting = optionalSetting.get();
                populateSetting(setting, requestData);
                Setting _setting = settingRepository.save( setting);

                return ResponseHandler.generateResponse(
                        "Setting was updated successful.",
                        HttpStatus.OK,
                        _setting
                );

            }
            return ResponseHandler.generateResponse(
                    "Error. Setting with id" + id +"not found",
                    HttpStatus.NOT_FOUND,
                    null
            );

        } catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateSetting(Setting setting, SettingRequest requestData){
        setting.setCategory(SettingCategory.valueOf( requestData.getCategory()));
        setting.setStartDate( requestData.getStartDate());
        setting.setEndDate( requestData.getEndDate());
        setting.setYear(requestData.getYear());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteSetting(@PathVariable long id){
        try{
            Optional<Setting> optionalSetting = settingRepository.findById(id);
            if(optionalSetting.isPresent()){
                settingRepository.deleteById(id);
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Setting with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    @DeleteMapping()
    public ResponseEntity<Object> deleteSettings(){
        try{
            settingRepository.deleteAll();
            return ResponseHandler.generateResponse(
                    "All settings have been deleted",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }
}
