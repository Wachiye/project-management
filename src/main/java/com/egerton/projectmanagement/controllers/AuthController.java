package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.Login;
import com.egerton.projectmanagement.models.Staff;
import com.egerton.projectmanagement.models.Student;
import com.egerton.projectmanagement.repositories.LoginRepository;
import com.egerton.projectmanagement.repositories.StaffRepository;
import com.egerton.projectmanagement.repositories.StudentRepository;
import com.egerton.projectmanagement.requests.LoginRequest;
import com.egerton.projectmanagement.services.JwtStaffUserDetailsService;
import com.egerton.projectmanagement.services.JwtStudentDetailsService;
import com.egerton.projectmanagement.utils.JwTokenUtil;
import com.egerton.projectmanagement.utils.Password;
import com.egerton.projectmanagement.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private JwtStudentDetailsService studentDetailsService;
    @Autowired
    private JwtStaffUserDetailsService staffUserDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest requestData) throws Exception {
           String email = requestData.getEmail();
           String password = requestData.getPassword();
           String role = requestData.getRole();

        Login _login = new Login();
        _login.setEmail( email);
        _login.setRole( role);
        _login.setLoginAt( new Date());

        boolean found = false;

            if( role.equalsIgnoreCase("student")) {
                Optional<Student> optionalStudent = studentRepository.findStudentByEmail(email);
                if( optionalStudent.isPresent() && Password.checkpw(password, optionalStudent.get().getPassword())){
                   found = true;
                }
                else{
                    found = false;
                }
            }

            else if( role.equalsIgnoreCase("staff")){
                Optional<Staff> optionalStaff = staffRepository.findStaffByEmail(email);
                if(optionalStaff.isPresent()){
                    found = true;
                }
                else{
                    found = false;
                }
            }

        if((role.equalsIgnoreCase("student") || role.equalsIgnoreCase("staff")) && found){
            return createLogin(_login);
        } else {
            return ResponseHandler.generateResponse(
                    "Login failed. Bad credentials",
                    HttpStatus.BAD_REQUEST,
                    null
            );
        }

    }

    protected ResponseEntity<Object> createLogin( Login login){
        try {
            Login results = loginRepository.save( login);
            return ResponseHandler.generateResponse(
                    "Access Granted. Login was successful.",
                    HttpStatus.OK,
                    results
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

    @PostMapping("/authenticate")
    public ResponseEntity<Object> authenticate(@RequestBody LoginRequest requestData){
        try {

            final UserDetails userDetails;

            if( requestData.getRole().equalsIgnoreCase("student")){
                System.out.println("Student");
                userDetails = studentDetailsService.loadUserByUsername(requestData.getEmail());
            } else if( requestData.getRole().equalsIgnoreCase("staff")){
                System.out.println("Staff");
                userDetails = staffUserDetailsService.loadUserByUsername(requestData.getEmail());
            } else{
                return ResponseHandler.generateResponse(
                        "Error. Unknown Role. Expected student or staff",
                        HttpStatus.BAD_REQUEST,
                        null
                );
            }
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken( requestData.getEmail(), requestData.getPassword())
            );

            final String token = jwtTokenUtil.generateToken(userDetails);

            //TODO SAve the token to db
            //TODO create logout router
            return ResponseHandler.generateResponse(
                    "Login was successful",
                    HttpStatus.OK,
                    token
            );
        } catch (BadCredentialsException ex){
            ex.printStackTrace();
            return ResponseHandler.generateResponse(
                    "Invalid Email or Password",
                    HttpStatus.BAD_REQUEST,
                    null
            );
        }

    }

//    @PostMapping("/logout")
//    public ResponseEntity<Object> logout(@Valid @RequestBody LoginRequest requestData){
//
//    }
//
//    @PostMapping("/pwd")
//    public ResponseEntity<Object> changePassword(@Valid @RequestBody LoginRequest requestData){
//
//    }
}
