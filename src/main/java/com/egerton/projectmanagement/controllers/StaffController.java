package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.ProjectRepository;
import com.egerton.projectmanagement.repositories.StaffRepository;
import com.egerton.projectmanagement.repositories.StudentRepository;
import com.egerton.projectmanagement.repositories.UserRepository;
import com.egerton.projectmanagement.requests.StaffRequest;
import com.egerton.projectmanagement.utils.Password;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/staff")

public class StaffController {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private StudentRepository studentRepository;

    // get all staffs
    @GetMapping()
    public ResponseEntity<Object> getAllStaffs(){
        try{
            //empty array list of staffs
            List<Staff> staffs = new ArrayList<>();
            //get staffs and populate the array list
            staffRepository.findAll().forEach( staffs::add);
            if(staffs.isEmpty()){ // no staffs found
                return  ResponseHandler.generateResponse(
                        "No staff record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    staffs
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //get single staff
    @GetMapping("/{id}")
    public ResponseEntity<Object> getStaff(@PathVariable("id") long id){
        try{
            //find staff by id
            Optional<Staff> optionalStaff = staffRepository.findById(id);
            //staff found
            return optionalStaff.map(staff -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    staff
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Staff with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            //staff not found
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }
    //get projects
    @GetMapping("/{id}/projects")
    public ResponseEntity<Object> getProjects(@PathVariable("id") long id) {
        try {
            //find staff by id
            Optional<Staff> optionalStaff = staffRepository.findById(id);
            if (optionalStaff.isPresent()) {

                List<Project> projects = this.getProjects(optionalStaff);
                if(projects.isEmpty()) {
                    return  ResponseHandler.generateResponse(
                            "No Projects record was found",
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        projects
                );
            }
            return  ResponseHandler.generateResponse(
                    "No Staff record was found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //get students
    @GetMapping("/{id}/students")
    public ResponseEntity<Object> getStudents(@PathVariable("id") long id){
        try{
            //find staff by id
            Optional<Staff> optionalStaff = staffRepository.findById(id);
            if(optionalStaff.isPresent()){

                List<Project> projects = this.getProjects( optionalStaff);
                List<Student> students = null;

                if(!projects.isEmpty()){
                   projects.forEach( project ->  students.add( project.getStudent()));
                }

                if(students.isEmpty()){ // no student found
                    return  ResponseHandler.generateResponse(
                            "No Student record was found",
                            HttpStatus.NOT_FOUND,
                            null
                    );
                }
                return ResponseHandler.generateResponse(
                        null,
                        HttpStatus.OK,
                        students
                );
            }

            return  ResponseHandler.generateResponse(
                    "Staff not was found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    protected List<Project> getProjects( Optional<Staff> optionalStaff){
        List<Project> projects = null;

        if( optionalStaff.get().getUser().getRole().toString().equals("SUPERVISOR")){
            projects = projectRepository.findAllBySupervisor( optionalStaff.get());
        } else{
            projects = projectRepository.findAllByEvaluator( optionalStaff.get());
        }
        return  projects;
    }

    //create staff
    @PostMapping("/register")
    public ResponseEntity<Object> createStaff( @Validated  @RequestBody StaffRequest requestData){
        try{
            //check email
            if( userEmailExists( requestData.getEmail())){
                return ResponseHandler.generateResponse(
                        "Staff Registration Failed. Email already exists.",
                        HttpStatus.BAD_REQUEST,
                        null
                );
            }

            //check staff id
            if( staffIdExists( requestData.getStaffId())){
                return ResponseHandler.generateResponse(
                        "Staff Registration Failed. Staff ID already exists.",
                        HttpStatus.BAD_REQUEST,
                        null
                );
            }

            UserModel user = new UserModel();
            populateUser( user, requestData);
            user.setCreatedAt( new Date());

            //save user
            UserModel _user = userRepository.save( user);

            Staff staff = new Staff();
            staff.setUser( _user);
            staff.setStaffId( requestData.getStaffId());

            //save staff
            Staff _staff = staffRepository.save(staff);

            return ResponseHandler.generateResponse(
                    "Staff registration was successful.",
                    HttpStatus.OK,
                    _staff
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //update staff
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateStaff(@PathVariable("id") long id, @RequestBody StaffRequest request){
        try{
            //find staff by id
            Optional<Staff> optionalStaff = staffRepository.findById(id);
            if(optionalStaff.isPresent()) { //staff found

                Staff staff = optionalStaff.get();

                UserModel user = userRepository.findById( staff.getUser().get_id()).get();
                user.setFirstName(request.getFirstName());
                user.setLastName( request.getLastName());
                user.setEmail( request.getEmail());
                userRepository.save(user);

                //save staff
                staff.setStaffId(request.getStaffId());
                Staff _staff = staffRepository.save(staff);

                return ResponseHandler.generateResponse(
                        "Staff details updated successful.",
                        HttpStatus.OK,
                        _staff
                );
            }
            //staff not found
            return ResponseHandler.generateResponse(
                    "Staff with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    private void populateUser(UserModel user, StaffRequest requestData) {
        user.setFirstName( requestData.getFirstName());
        user.setLastName(requestData.getLastName());
        user.setEmail(requestData.getEmail());
        user.setPassword(Password.hashpwd( requestData.getPassword()));
        user.setRole( UserRoles.valueOf( requestData.getRole()));
        user.setUpdateAt( new Date());
    }

    //delete staff
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteStaff(@PathVariable("id") long id){
        try{
            //find staff
            Optional<Staff> optionalStaff = staffRepository.findById(id);
            if(optionalStaff.isPresent()){//staff found
                staffRepository.delete(optionalStaff.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Staff with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }

    //delete all staffs
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllStaffs(){
        try{
            staffRepository.deleteAll();
            return  ResponseHandler.generateResponse(
                    null,
                    HttpStatus.NO_CONTENT,
                    null
            );
        }catch(Exception exception){
        return ResponseHandler.generateResponse(exception);
        }
    }


    protected boolean userEmailExists( String email){
        Optional<UserModel> userOptional = userRepository.findUserByEmail( email);
        if ( userOptional.isPresent()){
            return  true;
        }
        return false;
    }

    protected  boolean staffIdExists( String staffId){
        Optional<Staff> userOptional = staffRepository.findStaffByStaffId( staffId);
        if ( userOptional.isPresent()){
            return  true;
        }
        return false;
    }
}
