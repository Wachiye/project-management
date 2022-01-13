package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.*;
import com.egerton.projectmanagement.requests.ProjectRequest;
import com.egerton.projectmanagement.services.EmailService;
import com.egerton.projectmanagement.utils.DateUtil;
import com.egerton.projectmanagement.utils.ResponseHandler;
import com.egerton.projectmanagement.utils.SettingsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@RestController
@RequestMapping("/api/v1/projects")
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

    @Autowired
    private SettingRepository settingRepository;

    @Value(value="spring.mail.username")
    private String SYSTEM_EMAIL;

    @Autowired
    private EmailService emailService;
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //create project
    @PostMapping()
    public ResponseEntity<Object> createProject(@Validated @RequestBody ProjectRequest requestData){
        try{
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(requestData.getStudentId());
            //find evaluator
            Optional<Staff> optionalEvaluator = staffRepository.findById(requestData.getEvaluatorId());

            Optional<Setting> optionalSetting = settingRepository.findSettingByYearAndCategory( DateUtil.thisYear() , SettingCategory.PROJECT);

            if(optionalSetting.isPresent()) {
                if (!SettingsUtil.isActive(optionalSetting.get())) {
                    return ResponseHandler.generateResponse(
                            "Sorry. Cannot submit your Project. Project " +
                                    "submission period is invalid. \r\n" +
                                    "Start Date: " + optionalSetting.get().getStartDate().toString() + "\r\n"+
                                    "End Date: " + optionalSetting.get().getEndDate(),
                            HttpStatus.PRECONDITION_FAILED,
                            null
                    );
                }
                if(optionalStudent.isPresent() && optionalEvaluator.isPresent()){
                    //create project object
                    Project project = new Project();
                    //populate project object with data
                    populateProject(project, requestData);
                    project.setStudent( optionalStudent.get());
                    project.setEvaluator( optionalEvaluator.get());
                    project.setStatus(Status.WAITING_APPROVAL);
                    project.setCreatedAt( new Date());
                    project.setUpdateAt( new Date());

                    //save project
                    Project _project = projectRepository.save(project);

                    //send email to evaluator
                    Student student = optionalStudent.get();
                    Staff evaluator = optionalEvaluator.get();
                    sendEvaluatorEmail(student, _project, evaluator);

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
            }
            return ResponseHandler.generateResponse(
                    "Sorry. Project Creation is not open. Contact Your Evaluator or Try again later.",
                    HttpStatus.PRECONDITION_FAILED,
                    null
            );

        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //update project
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProject(@PathVariable("id") long id, @Validated @RequestBody ProjectRequest requestData){
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
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateProject( Project project, ProjectRequest requestData){
        project.setName( requestData.getName());
        project.setDescription(requestData.getDescription());
        project.setCategory(ProjectCategory.valueOf(requestData.getCategory()));
        project.setLanguages( requestData.getLanguages());
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
                        project.setStartDate( new Date());
                        project.setEndDate( null);
                        break;
                    case FINISHED:
                        if(hasPendingMilestones(project)){
                            return ResponseHandler.generateResponse(
                                    "Project has pending milestones.",
                                    HttpStatus.BAD_REQUEST,
                                    null
                            );
                        }
                        project.setEndDate( new Date());
                        break;
                    default: break;
                }

                project.setUpdateAt(new Date());

                //save project
                Project _project = projectRepository.save(project);

                //send email to student
                Student student = optionalProject.get().getStudent();
                sendStatusEmail( student, project);

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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }
    private  boolean hasPendingMilestones(Project project){
        Set<Milestone> milestones = project.getMilestones();
        for (Milestone milestone: milestones) {
            if(milestone.getStatus().compareTo( Status.FINISHED) != 0 )
                return true;
        }
        return false;
    }
    // change supervisor
    @PutMapping("/{id}/supervisor/{supervisorId}")
    public ResponseEntity<Object> setSupervisor(@PathVariable("id") long id, @PathVariable("supervisorId") long supervisorId){
        try{

            //find project by id
            Optional<Project> optionalProject = projectRepository.findById(id);
            //find supervisor by id
            Optional<Staff> optionalStaff = staffRepository.findById(supervisorId);
            if(optionalProject.isPresent() && optionalStaff.isPresent()) { //project and supervisor found

                Project project = optionalProject.get();
                Staff supervisor = optionalStaff.get();
                Student student = optionalProject.get().getStudent();

                if( supervisor.getUser().getRole().toString().equals("SUPERVISOR")){
                    project.setSupervisor( supervisor);
                    project.setUpdateAt(new Date());

                    //save project
                    Project _project = projectRepository.save(project);

                    //email to student and supervisor
                    sendSupervisorAssignmentEmail(student, project);

                    return ResponseHandler.generateResponse(
                            "Project assigned supervisor successful.",
                            HttpStatus.OK,
                            _project
                    );
                }

                return ResponseHandler.generateResponse(
                        "Selected User is not a supervisor.",
                        HttpStatus.BAD_REQUEST,
                        null
                );

            }
            // project not found
            return ResponseHandler.generateResponse(
                    "Project / Supervisor not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
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
        }catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    protected void sendEvaluatorEmail(Student student, Project project, Staff evaluator){

        Email email = new Email();
        email.setFrom( this.SYSTEM_EMAIL);
        email.setSenderName("Academic Project Approval And Management System");
        email.setTo( evaluator.getUser().getEmail());

        String subject = student.getUser().getLastName() + "(" + student.getRegNo().replace("/","_") + ")" +
                " has created a project";
        email.setSubject(subject);

        String text = "<p>Hi, " + evaluator.getUser().getLastName() + "</p>" +
                "<p>Your student: <b>" + student.getUser().getFullName() + " of Reg No" + student.getRegNo() + "</b> has created a new project </p>" +
                "<p>Project:" + project.getName() + " </p/> </br>" +
                "<article>" + project.getDescription() + "</article>" +
                "<hr />";

        text += "<p> Please login to the system to review the project </p>";

        text += "<p> -" + project.getEvaluator().getUser().getFirstName() + " " + project.getEvaluator().getUser().getLastName() + "<br />" +
                "Project Evaluator </p>";

        email.setText(text);
        email.setAttachments(null);

        emailService.sendHtml( email);
    }
    protected void sendStatusEmail(Student student, Project project){
        Email email = new Email();
        email.setFrom( this.SYSTEM_EMAIL);
        email.setSenderName("Academic Project Approval And Management System");
        email.setTo( student.getUser().getEmail());
        email.setCc( project.getSupervisor().getUser().getEmail());
        email.setSubject("Your project Has been" + project.getStatus().toString());

        String text = "<p>Hello, " + student.getUser().getFirstName() + " " + student.getUser().getLastName() + "</p>" +
                "<p> Your Project: <b>" + project.getName() + "</b> has been " + project.getStatus().toString() +" </p>";

        if(project.getStatus().toString().equals("ACCEPTED"))
            text += "<p> We hope that the online platform will help you manage your project effectively <br />" +
                    "Good luck as you tackle your project. </p>";

        text += "<p> -" + project.getEvaluator().getUser().getFirstName() + " " + project.getEvaluator().getUser().getLastName() + "<br />" +
                "Project Evaluator </p>";

        email.setText(text);
        email.setAttachments(null);

        emailService.sendHtml( email);
    }

    protected void sendSupervisorAssignmentEmail(Student student, Project project){
        Email email = new Email();
        email.setFrom( this.SYSTEM_EMAIL);
        email.setSenderName("Academic Project Approval And Management System");
        email.setTo( student.getUser().getEmail());
        email.setSubject("Project Supervisor Assigned");

        String text = "<p>Hi, " + student.getUser().getLastName() + "</p>" +
                "<p> Project: <b>" + project.getName() + "</b> has been assigned a new Supervisor </p>";

        text += "<strong>Supervisor: </strong>" + project.getSupervisor().getUser().getFirstName() + " " + project.getSupervisor().getUser().getLastName() + "\r\n" +
                "<strong>Student: </strong>" + student.getUser().getFirstName() + " " + student.getUser().getLastName() + "\r\n";

            text += "<p> We hope that the online platform will help you manage your project effectively <br />" +
                    "Good luck as you tackle your project. </p>";

        text += "<p> -" + project.getEvaluator().getUser().getFirstName() + " " + project.getEvaluator().getUser().getLastName() + "<br />" +
                "Project Evaluator </p>";

        email.setText(text);
        email.setAttachments(null);

        emailService.sendHtml( email);
    }
}
