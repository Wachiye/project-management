package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Staff;
import com.egerton.projectmanagement.models.StaffRoles;
import com.egerton.projectmanagement.repositories.StaffRepository;
import com.egerton.projectmanagement.requests.StaffRequest;
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
@RequestMapping("/api/v1/staff")
public class StaffController {

    @Autowired
    private StaffRepository staffRepository;

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
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
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
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //create staff
    @PostMapping()
    public ResponseEntity<Object> createStaff(@Valid @RequestBody StaffRequest requestData){
        try{
            //get data
            Staff staff = new Staff();
            populateStaff(staff, requestData);
            staff.setCreatedAt( new Date());
            staff.setUpdateAt( new Date());

            //save staff
            Staff _staff = staffRepository.save(staff);

            return ResponseHandler.generateResponse(
                    "Staff registration was successful.",
                    HttpStatus.OK,
                    _staff
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

    //update staff
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateStaff(@PathVariable("id") long id, @Valid @RequestBody StaffRequest requestData){
        try{
            //find staff by id
            Optional<Staff> optionalStaff = staffRepository.findById(id);
            if(optionalStaff.isPresent()) { //staff found

                Staff staff = optionalStaff.get();
                populateStaff(staff, requestData);
                staff.setUpdateAt(new Date());

                //save staff
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
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    protected void populateStaff( Staff staff, StaffRequest requestData){
        staff.setStaffId( requestData.getStaffId());
        staff.setFirstName( requestData.getFirstName());
        staff.setLastName(requestData.getLastName());
        staff.setEmail(requestData.getEmail());
        staff.setPassword(requestData.getPassword()); //must be hashed
        staff.setRole( StaffRoles.valueOf( requestData.getRole()));
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
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
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
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    // get all staffs
    @GetMapping("/role/{role}")
    public ResponseEntity<Object> getAllStaffsByRole(@PathVariable("role") String role){
        try{
            //empty array list of staffs
            List<Staff> staffs = new ArrayList<>();
            //get staffs and populate the array list
            staffRepository.findAllByRole( StaffRoles.valueOf( role)).forEach( staffs::add);
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
