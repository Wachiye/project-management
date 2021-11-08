package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.*;
import com.egerton.projectmanagement.requests.ProjectRequest;
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
@RequestMapping("/api/v1/projects")
@CrossOrigin
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ProjectFileRepository fileRepository;

    @Autowired
    private CommentRepository commentRepository;

    // get all projects
    @GetMapping()
    public ResponseEntity<Object> getAllProjects(){
        try{
            //empty array list of projects
            List<Project> projects = new ArrayList<>();
            //get projects and populate the array list
            projectRepository.findAll().forEach( projects::add);
            if(projects.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No project record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projects
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

    //get single project
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProject(@PathVariable("id") long id){
        try{
            //find project by id
            Optional<Project> optionalProject = projectRepository.findById(id);
            //project found
            return optionalProject.map(project -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    project
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Project with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            // project not found
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //create project
    @PostMapping()
    public ResponseEntity<Object> createProject(@Valid @RequestBody ProjectRequest requestData){
        try{
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(requestData.getStudentId());
            //find evaluator
            Optional<Staff> optionalEvaluator = staffRepository.findById(requestData.getEvaluatorId());

            if(optionalStudent.isPresent() && optionalEvaluator.isPresent()){
                //create project object
                Project project = new Project();
                //populate project object with data
                populateProject(project, requestData);
                project.setStudent( optionalStudent.get());
                project.setStatus(Status.WAITING_APPROVAL);
                project.setCreatedAt( new Date());
                project.setUpdateAt( new Date());

                //save project
                Project _project = projectRepository.save(project);

                return ResponseHandler.generateResponse(
                        "Project created successfully.",
                        HttpStatus.OK,
                        _project
                );
            }

            return ResponseHandler.generateResponse(
                    "Error. Could not create project. Student/Evaluator not found.",
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

    //update project
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProject(@PathVariable("id") long id, @Valid @RequestBody ProjectRequest requestData){
        try{
            //find project by id
            Optional<Project> optionalProject = projectRepository.findById(id);
            if(optionalProject.isPresent()) { //project found

                Project project = optionalProject.get();
                populateProject(project, requestData);
                project.setUpdateAt(new Date());

                //save project
                Project _project = projectRepository.save(project);

                return ResponseHandler.generateResponse(
                        "Project details updated successful.",
                        HttpStatus.OK,
                        _project
                );
            }
            // project not found
            return ResponseHandler.generateResponse(
                    "Project with id " + id + " not found",
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

    protected void populateProject( Project project, ProjectRequest requestData){
        project.setName( requestData.getName());
        project.setShortDesc( requestData.getShortDesc());
        project.setDescription(requestData.getDescription());
        project.setCategory(ProjectCategory.valueOf(requestData.getCategory()));
        project.setLanguages( requestData.getLanguages());
        project.setEvaluatorId(requestData.getEvaluatorId());
        project.setStartDate( requestData.getStartDate());
        project.setEndDate( requestData.getEndDate());
    }


    //get project milestones
    @GetMapping("/{id}/milestones")
    public  ResponseEntity<Object> getMilestones(@PathVariable("id") long id){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(id);
            if(optionalProject.isPresent()){//project found
                //empty array list of milestones
                List<Milestone> milestones = new ArrayList<>();
                //get milestones and populate the array list
                milestoneRepository.findAllByProject(optionalProject.get()).forEach( milestones::add);
                if(milestones.isEmpty()){ // no milestones found
                    return  ResponseHandler.generateResponse(
                            "No milestone record was found with project id " + id,
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }
                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        milestones
                );
            }
            return ResponseHandler.generateResponse(
                    "Project with id " + id + " not found",
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

    //get files
    @GetMapping("/{id}/files")
    public  ResponseEntity<Object> getFiles(@PathVariable("id") long id){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(id);
            if(optionalProject.isPresent()){//project found
                //empty array list of files
                List<ProjectFile> files = new ArrayList<>();
                //get files and populate the array list
                fileRepository.findAllByProject(optionalProject.get()).forEach(files::add);

                if(files.isEmpty()){ // no tasks found
                    return  ResponseHandler.generateResponse(
                            "No file record was found with project id " + id,
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }

                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        files
                );
            }
            return ResponseHandler.generateResponse(
                    "Project with id " + id + " not found",
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

    //get comments
    @GetMapping("/{id}/comments")
    public  ResponseEntity<Object> getComments(@PathVariable("id") long id){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(id);
            if(optionalProject.isPresent()){//project found
                //empty array list of comments
                List<Comment> comments = new ArrayList<>();
                //get comments and populate the array list
                commentRepository.findAllByProject( optionalProject.get()).forEach(comments::add);

                if(comments.isEmpty()){ // no comments found
                    return  ResponseHandler.generateResponse(
                            "No comment record was found with project id " + id,
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }

                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        comments
                );
            }
            return ResponseHandler.generateResponse(
                    "Project with id " + id + " not found",
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

    // get all projects by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Object> getAllProjectsByStatus(@PathVariable("status") String status){
        try{
            //empty array list of staffs
            List<Project> projects = new ArrayList<>();
            //get projects and populate the array list
            projectRepository.findAllByStatus( Status.valueOf(status)).forEach( projects::add);
            if(projects.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No project record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projects
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

            //find project by id
            Optional<Project> optionalProject = projectRepository.findById(id);
            if(optionalProject.isPresent()) { //project found

                Project project = optionalProject.get();
                Status _status = Status.valueOf(status);
                project.setStatus( _status);

                switch (_status){
                    case IN_PROGRESS:
                        project.setStartedOn( new Date());
                        break;
                    case FINISHED:
                        project.setFinishedOn( new Date());
                        break;
                    default: break;
                }

                project.setUpdateAt(new Date());

                //save project
                Project _project = projectRepository.save(project);

                return ResponseHandler.generateResponse(
                        "Project status changed successful.",
                        HttpStatus.OK,
                        _project
                );
            }
            // project not found
            return ResponseHandler.generateResponse(
                    "Project with id " + id + " not found",
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
    // get all projects by category
    @GetMapping("/category/{category}")
    public ResponseEntity<Object> getAllProjectsByCategory(@PathVariable("category") String category){
        try{
            //empty array list of project
            List<Project> projects = new ArrayList<>();
            //get projects and populate the array list
            projectRepository.findAllByCategory(ProjectCategory.valueOf( category)).forEach(projects::add);
            if(projects.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No project record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projects
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

    //delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProject(@PathVariable("id") long id){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(id);
            if(optionalProject.isPresent()){//project found
                projectRepository.delete(optionalProject.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Project with id " + id + " not found",
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

    //delete all projects
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllProjects(){
        try{
            projectRepository.deleteAll();
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
