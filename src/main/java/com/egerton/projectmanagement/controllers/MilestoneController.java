package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.MilestoneRepository;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.repositories.TaskRepository;
import com.egerton.projectmanagement.requests.MilestoneRequest;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/api/v1/milestones")

public class MilestoneController {

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

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
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
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
                milestone.setProject( optionalProject.get());
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

        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateMilestone( Milestone milestone, MilestoneRequest requestData){
        milestone.setName( requestData.getName());
        milestone.setStartDate( requestData.getStartDate());
        milestone.setEndDate( requestData.getEndDate());
    }

    //get milestone milestones
    @GetMapping("/{id}/tasks")
    public  ResponseEntity<Object> getTasks(@PathVariable("id") long id){
        try{
            //find milestone
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
            if(optionalMilestone.isPresent()){//milestone found
                //empty array list of tasks
                List<Task> tasks = new ArrayList<>();
                //get tasks and populate the array list
                taskRepository.findAllByMilestone(optionalMilestone.get()).forEach(tasks::add);

                if(tasks.isEmpty()){ // no tasks found
                    return  ResponseHandler.generateResponse(
                            "No task record was found with milestone id " + id,
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }

                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        tasks
                );
            }
            return ResponseHandler.generateResponse(
                    "Milestone with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
                Project project = milestone.getProject();

                Status _status = Status.valueOf(status);
                milestone.setStatus( _status);

                switch (_status){
                    case IN_PROGRESS:
                        if( project.getStartDate() == null || project.getStatus().compareTo( Status.IN_PROGRESS) != 0){
                            project.setStatus( Status.IN_PROGRESS);
                            project.setStartDate( new Date());
                            projectRepository.save( project);
                        }
                        milestone.setStartDate( new Date());
                        milestone.setEndDate( null);
                        break;
                    case FINISHED:
                        if (hasPendingTasks(milestone)){
                            return ResponseHandler.generateResponse(
                                    "Milestone has pending tasks.",
                                    HttpStatus.BAD_REQUEST,
                                    null
                            );
                        }
                        if( isFinalMilestone(milestone, project )){
                            project.setEndDate( new Date());
                            project.setStatus( Status.FINISHED);
                            milestoneRepository.save( milestone);
                        }
                        milestone.setEndDate( new Date());
                        break;
                    default: break;
                }

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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }
    private  boolean hasPendingTasks(Milestone milestone){
        Set<Task> tasks = milestone.getTasks();
        for (Task t: tasks) {
            if(t.getStatus().compareTo( Status.FINISHED) != 0 )
               return true;
        }
        return false;
    }
    private boolean isFinalMilestone( Milestone milestone, Project project){
        Set<Milestone> milestones = project.getMilestones();
        for (Milestone m: milestones) {
            if(m.get_id() != milestone.get_id() && milestone.getStatus().compareTo( Status.FINISHED) != 0 )
                return  false;
        }
        return true;
    }
    //delete milestone
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMilestone(@PathVariable("id") long id){
        try{
            //find milestone
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
            if(optionalMilestone.isPresent()){//milestone found
                milestoneRepository.deleteById(id);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }
}
