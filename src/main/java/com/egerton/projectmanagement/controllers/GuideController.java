package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Guide;
import com.egerton.projectmanagement.models.Staff;
import com.egerton.projectmanagement.repositories.GuideRepository;
import com.egerton.projectmanagement.repositories.StaffRepository;
import com.egerton.projectmanagement.requests.GuideRequest;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
@RequestMapping("/api/v1/guides")
public class GuideController {
    @Autowired
    private GuideRepository guideRepository;
    @Autowired
    private StaffRepository staffRepository;

    // get all guides
    @GetMapping
    public ResponseEntity<Object> getAllGuides(){
        try{
            List<Guide> guides = new ArrayList<>();
            guideRepository.findAll().forEach( guides::add);
            if(guides.isEmpty()){
                return  ResponseHandler.generateResponse(
                        "No Guide record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    guides
            );
        }  catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    // get all guides
    @GetMapping("/{id}")
    public ResponseEntity<Object> getGuide(@PathVariable("id") long id){
        try{
            //find guide by id
            Optional<Guide> optionalGuide = guideRepository.findById(id);

            return optionalGuide.map(guide -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    guide
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Guide with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    // create guide
    @PostMapping
    public ResponseEntity<Object> createGuide(@Validated @RequestBody GuideRequest requestData){
        try{
            //find evaluator
            Optional<Staff> optionalStaff = staffRepository.findById(requestData.getStaffId());

            if(optionalStaff.isPresent()){
                Guide guide = new Guide();
                populateData(guide, requestData);
                guide.setCreatedBy( optionalStaff.get());
                guide.setCreatedAt(new Date());
                guide.setUpdateAt( new Date());

                //save guide
                Guide _guide = guideRepository.save(guide);

                return ResponseHandler.generateResponse(
                        "Guide posted successfully",
                        HttpStatus.OK,
                        guide
                );
            }
            return ResponseHandler.generateResponse(
                    "Sorry. Could not post guide. Staff not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    //update guide
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateGuide(@PathVariable("id") long id, @Validated @RequestBody GuideRequest requestData){
        try{
            //find guide
            Optional<Guide> optionalGuide = guideRepository.findById(id);

            if(optionalGuide.isPresent()){
                Guide guide = new Guide();
                populateData(guide, requestData);
                guide.setUpdateAt( new Date());

                //save guide
                Guide _guide = guideRepository.save(guide);

                return ResponseHandler.generateResponse(
                        "Guide updated successfully",
                        HttpStatus.OK,
                        guide
                );
            }
            return ResponseHandler.generateResponse(
                    "Guide width id " + id +" no found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch (Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateData( Guide guide, GuideRequest requestData){
        guide.setTitle( requestData.getTitle());
        guide.setContent( requestData.getContent());
    }
    // delete guide
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteGuide(@PathVariable("id") long id){
        try{
            //find guide
            Optional<Guide> optionalGuide = guideRepository.findById(id);
            if(optionalGuide.isPresent()){//guide found
                guideRepository.delete(optionalGuide.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Guide with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    //delete all guides
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllGuides(){
        try{
            guideRepository.deleteAll();
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }
}
