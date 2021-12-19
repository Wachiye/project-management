package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Milestone;
import com.egerton.projectmanagement.models.Project;
import com.egerton.projectmanagement.models.Status;
import com.egerton.projectmanagement.models.Task;
import com.egerton.projectmanagement.repositories.MilestoneRepository;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.repositories.TaskRepository;
import com.egerton.projectmanagement.requests.TaskRequest;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@RequestMapping("/api/v1/tasks")

public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // get all tasks
    @GetMapping()
    public ResponseEntity<Object> getAllTasks(){
        try{
            //empty array list of tasks
            List<Task> tasks = new ArrayList<>();
            //get tasks and populate the array list
            taskRepository.findAll().forEach( tasks::add);
            if(tasks.isEmpty()){ // no tasks found
                return  ResponseHandler.generateResponse(
                        "No task record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    tasks
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //get single task
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTask(@PathVariable("id") long id){
        try{
            //find task by id
            Optional<Task> optionalTask = taskRepository.findById(id);
            //task found
            return optionalTask.map(task -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    task
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            // task not found
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //create task
    @PostMapping()
    public ResponseEntity<Object> createTask(@Valid @RequestBody TaskRequest requestData){
        try{
            //find milestone
            Optional<Milestone> optionalMilestone = milestoneRepository.findById(requestData.getMilestoneId());

            if(optionalMilestone.isPresent()){
                Milestone milestone = optionalMilestone.get();
                //create task object
                Task task = new Task();
                //populate task object with data
                populateTask(task, requestData);
                task.setMilestone( milestone);
                task.setStatus(Status.PENDING);
                task.setCreatedAt( new Date());
                task.setUpdateAt( new Date());

                //save task
                Task _task = taskRepository.save(task);

                return ResponseHandler.generateResponse(
                        "Task created successfully.",
                        HttpStatus.OK,
                        _task
                );
            }

            return ResponseHandler.generateResponse(
                    "Error. Could not create task. Milestone not found",
                    HttpStatus.NOT_FOUND,
                    null
            );

        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //update task
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateTask(@PathVariable("id") long id, @Valid @RequestBody TaskRequest requestData){
        try{
            //find task by id
            Optional<Task> optionalTask = taskRepository.findById(id);
            if(optionalTask.isPresent()) { //task found

                Task task = optionalTask.get();
                populateTask(task, requestData);
                task.setUpdateAt(new Date());

                //save task
                Task _task = taskRepository.save(task);

                return ResponseHandler.generateResponse(
                        "Task details updated successful.",
                        HttpStatus.OK,
                        _task
                );
            }
            // task not found
            return ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateTask( Task task, TaskRequest requestData){
        task.setName( requestData.getName());
        task.setDescription( requestData.getDescription());
        task.setStartDate( requestData.getStartDate());
        task.setEndDate( requestData.getEndDate());
    }

    // get all task by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Object> getAllTasksByStatus(@PathVariable("status") String status){
        try{
            //empty array list of tasks
            List<Task> tasks = new ArrayList<>();
            //get tasks and populate the array list
            taskRepository.findAllByStatus( Status.valueOf(status)).forEach( tasks::add);
            if(tasks.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No task record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    tasks
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    // change status
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<Object> setStatus(@PathVariable("id") long id, @PathVariable("status") String status){
        try{

            //find task by id
            Optional<Task> optionalTask = taskRepository.findById(id);
            if(optionalTask.isPresent()) { //task found

                Task task = optionalTask.get();
                Milestone milestone = task.getMilestone();

                Status _status = Status.valueOf(status);

                task.setStatus( _status);

                switch (_status){
                    case IN_PROGRESS:
                        if( milestone.getStartDate() == null || milestone.getStatus().compareTo( Status.IN_PROGRESS) != 0){
                            milestone.setStatus( Status.IN_PROGRESS);
                            milestone.setStartDate( new Date());
                            milestoneRepository.save( milestone);
                        }
                        task.setStartDate( new Date());
                        task.setEndDate( null);
                        break;
                    case FINISHED:
                        task.setEndDate( new Date());
                        if( isFinalTaskInMilestone(task, milestone )){
                            milestone.setEndDate( new Date());
                            milestone.setStatus( Status.FINISHED);
                            milestoneRepository.save( milestone);
                        }
                        if( isFinalTaskInProject( task, milestone.getProject())){
                            Project project = milestone.getProject();
                            project.setStatus(Status.FINISHED);
                            project.setEndDate( new Date());
                            projectRepository.save(project);
                        }
                        break;
                    default: break;
                }

                task.setUpdateAt(new Date());

                //save task
                Task _task = taskRepository.save(task);

                return ResponseHandler.generateResponse(
                        "Task status changed successful.",
                        HttpStatus.OK,
                        _task
                );
            }
            // task not found
            return ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    private boolean isFinalTaskInMilestone( Task task, Milestone milestone){
        Set<Task> tasks = milestone.getTasks();

        for (Task t: tasks) {
            if(t.get_id() != task.get_id() && task.getStatus().compareTo( Status.FINISHED) != 0 )
                return  false;
        }

        return true;
    }

    private  boolean isFinalTaskInProject( Task task, Project project){
        Set<Task> tasks = null ;
        project.getMilestones().forEach( milestone -> {
            if(milestone.getTasks() != null)
                tasks.addAll(milestone.getTasks());
        });

        for (Task t: tasks) {
            if(t.get_id() != task.get_id() && task.getStatus().compareTo( Status.FINISHED) != 0 )
                return  false;
        }
        return  true;
    }
    //delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable("id") long id){
        try{
            //find task
            Optional<Task> optionalTask = taskRepository.findById(id);
            if(optionalTask.isPresent()){//task found
                taskRepository.delete(optionalTask.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            //task not found
            return ResponseHandler.generateResponse(
                    "Task with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //delete all tasks
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllTasks(){
        try{
            taskRepository.deleteAll();
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
