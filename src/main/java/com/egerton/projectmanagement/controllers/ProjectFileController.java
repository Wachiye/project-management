package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.ProjectFileRepository;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.repositories.SettingRepository;
import com.egerton.projectmanagement.repositories.StudentRepository;
import com.egerton.projectmanagement.requests.ProjectFileRequest;
import com.egerton.projectmanagement.services.EmailService;
import com.egerton.projectmanagement.services.FileService;
import com.egerton.projectmanagement.utils.DateUtil;
import com.egerton.projectmanagement.utils.ResponseHandler;
import javax.servlet.http.HttpServletRequest;

import com.egerton.projectmanagement.utils.SettingsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/files")

public class ProjectFileController {
    
    @Autowired
    private ProjectFileRepository fileRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private SettingRepository settingRepository;

    @Value(value="spring.mail.username")
    private String SYSTEM_EMAIL;

    @Autowired
    private EmailService emailService;
    // get all project files
    @GetMapping()
    public ResponseEntity<Object> getAllProjectFiles(){
        try{
            //empty array list of projectFiles
            List<ProjectFile> projectFiles = new ArrayList<>();
            //get projectFiles and populate the array list
            fileRepository.findAll().forEach( projectFiles::add);
            if(projectFiles.isEmpty()){ // no projectFiles found
                return  ResponseHandler.generateResponse(
                        "No project file record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projectFiles
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //get single project file
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProjectFile(@PathVariable("id") long id){
        try{
            //find project file by id
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            //projectFile found
            return optionalProjectFile.map(projectFile -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projectFile
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Project file with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            // projectFile not found
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //create project file
    @PostMapping()
    public ResponseEntity<Object> createProjectFile(HttpServletRequest request, @Validated @ModelAttribute ProjectFileRequest requestData, @RequestPart("file") MultipartFile file){
        try{
            //find project
            Optional<Project> optionalProject = projectRepository.findById(requestData.getProjectId());
            //find student
            Optional<Student> optionalStudent = studentRepository.findById(requestData.getStudentId());

            Optional<Setting> optionalSetting = settingRepository.findSettingByYearAndCategory(DateUtil.thisYear(), SettingCategory.valueOf(requestData.getFileType()));
            
            if(optionalSetting.isPresent()){
                if(!SettingsUtil.isActive( optionalSetting.get())){
                    return ResponseHandler.generateResponse(
                            "Sorry. Cannot submit your file." + requestData.getFileType() + 
                                " submission period is invalid.\r\n" +
                                    "Start Date: " + optionalSetting.get().getStartDate().toString() + "\r\n"+
                                    "End Date: " + optionalSetting.get().getEndDate(),
                            HttpStatus.PRECONDITION_FAILED,
                            null
                    ); 
                }
                if(optionalProject.isPresent() && optionalStudent.isPresent()){ // project and student found

                    Project project = optionalProject.get();

                    Student student = optionalStudent.get();

                    String fileType = FileType.valueOf( requestData.getFileType()).toString();

                    String[] fileParts = file.getOriginalFilename().split(".\\.");
                    String fileExtension = fileParts[ fileParts.length -1];

                    //upload file
                    String filename = fileType + "-" + student.getRegNo().replace("/","_") + "-" + student.getUser().getLastName() + "-" + project.get_id() + "." + fileExtension;
                    String fileURL = fileService.upload(requestData.getFile(), filename);

                    if(fileURL != null){
                        //create project file object
                        ProjectFile projectFile = new ProjectFile();
                        //populate project file object with data
                        projectFile.setProject( optionalProject.get());
                        projectFile.setName( requestData.getName());
                        projectFile.setDescription( requestData.getDescription());;
                        projectFile.setFileURL(fileURL);
                        projectFile.setStatus(Status.PENDING);
                        projectFile.setCreatedAt( new Date());
                        projectFile.setUpdateAt( new Date());

                        //save projectFile
                        ProjectFile _projectFile = fileRepository.save(projectFile);

                        //send supervisor email
                        sendSupervisorEmail(student, projectFile, fileType);

                        return ResponseHandler.generateResponse(
                                "Project file created successfully.",
                                HttpStatus.OK,
                                _projectFile
                        );
                    }
                    return ResponseHandler.generateResponse(
                            "Error. Server was unable to upload project file. Try gain later",
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            null
                    );
                }

                return ResponseHandler.generateResponse(
                        "Error. Could not create project file. Student/Project not found.",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            
            return ResponseHandler.generateResponse(
                    "Sorry. " + requestData.getFileType() + " Submission is not open. Contact Your Evaluator or Try again later.",
                    HttpStatus.PRECONDITION_FAILED,
                    null
            );

        } catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    //update projectFile
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProjectFile(@PathVariable("id") long id, @Validated @RequestBody ProjectFileRequest requestData){
        try{
            //find projectFile by id
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            if(optionalProjectFile.isPresent()) { //projectFile found

                ProjectFile projectFile = optionalProjectFile.get();
                projectFile.setName( requestData.getName());
                projectFile.setDescription( requestData.getDescription());
                projectFile.setUpdateAt(new Date());

                //save projectFile
                ProjectFile _projectFile = fileRepository.save(projectFile);

                return ResponseHandler.generateResponse(
                        "ProjectFile details updated successful.",
                        HttpStatus.OK,
                        _projectFile
                );
            }
            // projectFile not found
            return ResponseHandler.generateResponse(
                    "ProjectFile with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    // get all projectFile by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Object> getAllProjectFilesByStatus(@PathVariable("status") String status){
        try{
            //empty array list of projectFiles
            List<ProjectFile> projectFiles = new ArrayList<>();
            //get projectFiles and populate the array list
            fileRepository.findAllByStatus( Status.valueOf(status)).forEach( projectFiles::add);
            if(projectFiles.isEmpty()){ // no projects found
                return  ResponseHandler.generateResponse(
                        "No projectFile record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    projectFiles
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    // change status
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<Object> setStatus(@PathVariable("id") long id, @PathVariable("status") String status){
        try{

            //find projectFile by id
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            if(optionalProjectFile.isPresent()) { //projectFile found

                ProjectFile projectFile = optionalProjectFile.get();
                Status _status = Status.valueOf( status);
                projectFile.setStatus(_status);
                projectFile.setUpdateAt(new Date());

                //save projectFile
                ProjectFile _projectFile = fileRepository.save(projectFile);
                //send email to student
                Student student = projectFile.getProject().getStudent();
                switch (_status){
                    case ACCEPTED:
                        sendStatusEmail( student, projectFile, "Accepted");
                        break;
                    case REJECTED:
                        sendStatusEmail( student, projectFile, "Rejected");
                        break;
                    default: break;
                }
                return ResponseHandler.generateResponse(
                        "Project File status changed successful.",
                        HttpStatus.OK,
                        _projectFile
                );
            }
            // projectFile not found
            return ResponseHandler.generateResponse(
                    "ProjectFile with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //delete project file
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProjectFile(@PathVariable("id") long id){
        try{
            //find project file
            Optional<ProjectFile> optionalProjectFile = fileRepository.findById(id);
            if(optionalProjectFile.isPresent()){//project file found
                fileRepository.deleteById(id);
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            //project file not found
            return ResponseHandler.generateResponse(
                    "Project file with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //delete all projectFiles
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllProjectFiles(){
        try{
            fileRepository.deleteAll();
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected void sendStatusEmail(Student student, ProjectFile projectFile, String status){
        Email email = new Email();
        email.setFrom( this.SYSTEM_EMAIL);
        email.setSenderName("Academic Project");
        email.setTo( student.getUser().getEmail());
        email.setSubject("Your document has been " + status);

        Project project = projectFile.getProject();

        String text = "<p>Hello, " + student.getUser().getFirstName() + " " + student.getUser().getLastName() + "</p>" +
                "<p> Your document for project: <b>" + project.getName() + "</b> has been " + status +" </p>";

        if(status.equals("ACCEPTED"))
            text += "<p> We hope that the online platform will help you manage your project effectively <br />" +
                    "Good luck as you tackle your project. </p>";

        text += "<p> -" + project.getEvaluator().getUser().getFirstName() + " " + project.getEvaluator().getUser().getLastName() + "<br />" +
                "Project Evaluator </p>";

        email.setText(text);
        email.setAttachments(null);

        emailService.sendHtml( email);
    }

    protected void sendSupervisorEmail(Student student, ProjectFile projectFile, String fileType){
        Project project = projectFile.getProject();
        Staff supervisor = project.getSupervisor();

        Email email = new Email();
        email.setFrom( this.SYSTEM_EMAIL);
        email.setSenderName("Academic Project");
        email.setTo( student.getUser().getEmail());

        String subject = student.getUser().getLastName() + "(" + student.getRegNo().replace("/","_") + ")" +
                " has submitted " + fileType + " Document";
        email.setSubject(subject);

        String text = "<p>Hi, " + supervisor.getUser().getLastName() + "</p>" +
                "<p>Your student: <b>" + student.getUser().getFullName() + " of Reg No" + student.getRegNo() + "</b> has uploaded a new file </p>" +
                "<p>Login to the system to review the submitted file</p>";

        text += "<p> We hope that the online platform will help you manage your project effectively <br />" +
                "Good luck as you tackle your project. </p>";

        text += "<p> -" + project.getEvaluator().getUser().getFirstName() + " " + project.getEvaluator().getUser().getLastName() + "<br />" +
                "Project Evaluator </p>";

        email.setText(text);
        email.setAttachments(null);

        emailService.sendHtml( email);
    }
}
