package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.MilestoneRepository;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.requests.MilestoneRequest;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/milestones")
public class MilestoneController {

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // get all milestones
    @GetMapping()
    public ResponseEntity<Object> getAllMilestones(){
        try{
            //empty array list of milestones
            List<Milestone> milestones = new ArrayList<>();
            //get milestones and populate the array list
            milestoneRepository.findAll().forEach( milestones::add);
            if(milestones.isEmpty()){ // no milestones found
                return  ResponseHandler.generateResponse(
                        "No milestone record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    milestones
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //get single milestone
    @GetMapping("/{id}")
    public ResponseEntity<Object> getMilestone(@PathVariable("id") long id){
        try{
            //find milestone by id
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
            //milestone found
            return optionalMilestone.map(milestone -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    milestone
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Milestone with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            // milestone not found
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //create milestone
    @PostMapping()
    public ResponseEntity<Object> createMilestone(@Valid @RequestBody MilestoneRequest requestData){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(requestData.getProjectId());

            if(optionalProject.isPresent()){
                //create milestone object
                Milestone milestone = new Milestone();
                //populate milestone object with data
                populateMilestone(milestone, requestData);
                milestone.setStatus(Status.PENDING);
                milestone.setCreatedAt( new Date());
                milestone.setUpdateAt( new Date());

                //save milestone
                Milestone _milestone = milestoneRepository.save(milestone);

                return ResponseHandler.generateResponse(
                        "Milestone created successfully.",
                        HttpStatus.OK,
                        _milestone
                );
            }

            return ResponseHandler.generateResponse(
                    "Error. Could not create milestone. Student/Evaluator not found.",
                    HttpStatus.NOT_FOUND,
                    null
            );

        } catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //update milestone
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateMilestone(@PathVariable("id") long id, @Valid @RequestBody MilestoneRequest requestData){
        try{
            //find milestone by id
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
            if(optionalMilestone.isPresent()) { //milestone found

                Milestone milestone = optionalMilestone.get();
                populateMilestone(milestone, requestData);
                milestone.setUpdateAt(new Date());

                //save milestone
                Milestone _milestone = milestoneRepository.save(milestone);

                return ResponseHandler.generateResponse(
                        "Milestone details updated successful.",
                        HttpStatus.OK,
                        _milestone
                );
            }
            // milestone not found
            return ResponseHandler.generateResponse(
                    "Milestone with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    protected void populateMilestone( Milestone milestone, MilestoneRequest requestData){
        milestone.setName( requestData.getName());
        milestone.setProjectId(requestData.getProjectId());
        milestone.setStartDate( requestData.getStartDate());
        milestone.setEndDate( requestData.getEndDate());
    }
    
    // get all milestone by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Object> getAllMilestonesByStatus(@PathVariable("status") String status){
        try{
            //empty array list of milestones
            List<Milestone> milestones = new ArrayList<>();
            //get milestones and populate the array list
            milestoneRepository.findAllByStatus( Status.valueOf(status)).forEach( milestones::add);
            if(milestones.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No milestone record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    milestones
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    // change status
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<Object> setStatus(@PathVariable("id") long id, @PathVariable("status") String status){
        try{

            //find milestone by id
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
            if(optionalMilestone.isPresent()) { //milestone found

                Milestone milestone = optionalMilestone.get();
                milestone.setStatus( Status.valueOf(status));
                milestone.setUpdateAt(new Date());

                //save milestone
                Milestone _milestone = milestoneRepository.save(milestone);

                return ResponseHandler.generateResponse(
                        "Milestone status changed successful.",
                        HttpStatus.OK,
                        _milestone
                );
            }
            // milestone not found
            return ResponseHandler.generateResponse(
                    "Milestone with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }
    
    //delete milestone
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMilestone(@PathVariable("id") long id){
        try{
            //find milestone
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
            if(optionalMilestone.isPresent()){//milestone found
                milestoneRepository.delete(optionalMilestone.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            //milestone not found
            return ResponseHandler.generateResponse(
                    "Milestone with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //delete all milestones
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllMilestones(){
        try{
            milestoneRepository.deleteAll();
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }
}
