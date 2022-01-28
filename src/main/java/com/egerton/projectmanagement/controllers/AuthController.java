package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.LoginRepository;
import com.egerton.projectmanagement.repositories.UserRepository;
import com.egerton.projectmanagement.requests.LoginRequest;
import com.egerton.projectmanagement.requests.PasswordRequest;
import com.egerton.projectmanagement.requests.RegisterRequest;
import com.egerton.projectmanagement.services.EmailService;
import com.egerton.projectmanagement.services.JwtUserDetailsService;
import com.egerton.projectmanagement.utils.JwTokenUtil;
import com.egerton.projectmanagement.utils.Password;
import com.egerton.projectmanagement.utils.ResponseHandler;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")

public class AuthController {
    @Autowired
    private LoginRepository loginRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUserDetailsService userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwTokenUtil jwtTokenUtil;

    @Value(value="spring.mail.username")
    private String SYSTEM_EMAIL;
    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/register", consumes ="application/json" )
    public ResponseEntity<Object> register(@Validated @RequestBody RegisterRequest requestData) {
        try{
            String email = requestData.getEmail();
           Optional<UserModel> userOptional = userRepository.findUserByEmail( email);
           if ( userOptional.isPresent()){
               return ResponseHandler.generateResponse(
                       "Registration Failed. Email already exists.",
                       HttpStatus.BAD_REQUEST,
                       null
               );
           }

           UserModel userModel = new UserModel();
           populateUser(userModel, requestData);

            //generate verification code
            String randomCode = RandomString.make(64);
            userModel.setVerificationCode( randomCode);

           //save user
            UserModel _userModel = userRepository.save(userModel);

            emailService.sendVerificationCode( userModel, requestData.getVerificationURL());

            return ResponseHandler.generateResponse(
                    "User registration was successful. Please check email for account verification link",
                    HttpStatus.OK,
                    _userModel
            );
        } catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

    protected void populateUser(UserModel userModel, RegisterRequest requestData){
        userModel.setFirstName( requestData.getFirstName());
        userModel.setLastName(requestData.getLastName());
        userModel.setEmail(requestData.getEmail());
        userModel.setRole( UserRoles.valueOf( requestData.getRole()));
        userModel.setPassword(Password.hashpwd( requestData.getPassword()));
        userModel.setCreatedAt( new Date());
        userModel.setUpdateAt( new Date());

        //generate verification code
        String randomCode = RandomString.make(64);
        userModel.setActive(false);
        userModel.setVerificationCode(randomCode);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest requestData){
        try {
            //logout all active sessions
            Optional<Login> _login = loginRepository.findLoginByEmail( requestData.getEmail());

            if( _login.isPresent())
                loginRepository.deleteById(_login.get().get_id());
            UserModel user = userRepository.findUserByEmail(requestData.getEmail()).get();

            if(user.isActive()){
                final UserDetails userDetails = userDetailsService.loadUserByUsername(requestData.getEmail());;

                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken( requestData.getEmail(), requestData.getPassword())
                );

                final String token = jwtTokenUtil.generateToken(userDetails);

                Login login = new Login();
                login.setRole( user.getRole().toString());
                login.setEmail(requestData.getEmail());
                login.setToken(token);

                return  saveLogin(login);
            }

            return ResponseHandler.generateResponse(
                    "Login failed. Your account is not verified. Please check email to verify and try again.",
                    HttpStatus.UNAUTHORIZED,
                    null
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
    protected ResponseEntity<Object> saveLogin( Login login){
        try {
            Login results = loginRepository.save( login);
            return ResponseHandler.generateResponse(
                    "Access Granted. Login was successful.",
                    HttpStatus.OK,
                    results
            );
        } catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<Object> logout(HttpServletRequest request){
        try {
            final  String authHeader = request.getHeader("Authorization");
            String jwtToken = authHeader.substring(7) ;

            Optional<Login> login = loginRepository.findLoginByToken( jwtToken);

            if( login.isPresent()){
                Login _login = login.get();
                loginRepository.deleteById(_login.get_id());

                SecurityContextHolder.getContext().setAuthentication(null);
                return ResponseHandler.generateResponse(
                        "Logout was successful.",
                        HttpStatus.OK,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Auth Token not found. Please Login first",
                    HttpStatus.BAD_REQUEST,
                    null
            );
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseHandler.generateResponse(
                    ex.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }

    }

    @PostMapping("/pwd")
    public ResponseEntity<Object> requestPassword(HttpServletRequest request){
        try {
            String email = request.getParameter("email");
            Optional<UserModel> user = userRepository.findUserByEmail(email);
            if(user.isPresent()){
                UserModel _user = user.get();
                String randomPassword = Password.getRandomPassword();

                _user.setPassword( Password.hashpwd( randomPassword));
                _user.setUpdateAt( new Date());
                userRepository.save( _user);

                //email user the random password
                Email mail = new Email();
                mail.setFrom( SYSTEM_EMAIL);
                mail.setSenderName("APAMS EGERTON");
                mail.setSubject("Password Reset Request");
                mail.setTo(_user.getEmail());
                mail.setText("<p> Hi" + _user.getLastName() +", please use the following password to login in. <br>" +
                        "Password: " + randomPassword + "</p>");
                mail.setAttachments(null);

                if (emailService.sendHtml( mail) ) {
                    return ResponseHandler.generateResponse(
                            "Please check email for new password.",
                            HttpStatus.OK,
                            null
                    );
                }
                return ResponseHandler.generateResponse(
                        "Sorry, Server could not complete your request. Ensure you have an active internet connection and your email is valid.",
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "No user account exists with given email:" + email,
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }

    }

    @PostMapping("/changepwd")
    public ResponseEntity<Object> changePassword(@Validated @RequestBody PasswordRequest requestData){
        try {
            String oldPassword = requestData.getOldPassword();
            String newPassword = requestData.getPassword();
            String email = requestData.getEmail();

            Optional<UserModel> user = userRepository.findUserByEmail(email);
            if(user.isPresent()){
                UserModel _user = user.get();
                //check password
                boolean pwdMatch = Password.checkpw(oldPassword, _user.getPassword());

                if( pwdMatch){
                    _user.setPassword( Password.hashpwd( newPassword));
                    _user.setUpdateAt( new Date());
                    userRepository.save( _user);

                    return ResponseHandler.generateResponse(
                            "Password changed successfully. Please use your new password to login next time",
                            HttpStatus.OK,
                            null
                    );
                }

                return ResponseHandler.generateResponse(
                        "Your old passwords don't match",
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "No user account exists with given email:" + email,
                    HttpStatus.NOT_FOUND,
                    null
            );
        } catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }

    }

    @PostMapping("/verify/{code}")
    public ResponseEntity<Object> verifyAccount( @PathVariable("code") String code){
        try{
            Optional<UserModel> user = userRepository.findUserModelByVerificationCode(code);
            if(user.isPresent()) {
                UserModel _user = user.get();
                _user.setActive( true);
                userRepository.save( _user);
                return ResponseHandler.generateResponse(
                        "Hi " + _user.getFullName() + ". Your account has been verified. Use Your email and password to login",
                        HttpStatus.OK,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Verification failed. Invalid Verification Code",
                    HttpStatus.NOT_FOUND,
                    null
            );

        } catch(Exception exception){
            return ResponseHandler.generateResponse(exception);
        }
    }

}
