package com.egerton.projectmanagement.controllers;

import com.egerton.projectmanagement.models.*;
import com.egerton.projectmanagement.repositories.NotificationRepository;
import com.egerton.projectmanagement.repositories.StaffRepository;
import com.egerton.projectmanagement.requests.CommentRequest;
import com.egerton.projectmanagement.requests.NotificationRequest;
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
@RequestMapping("/api/v1/notifications")

public class NotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private StaffRepository staffRepository;

    // get all notifications
    @GetMapping()
    public ResponseEntity<Object> getAllNotifications(){
        try{
            //empty array list of notifications
            List<Notification> notifications = new ArrayList<>();
            //get notifications and populate the array list
            notificationRepository.findAll().forEach( notifications::add);
            if(notifications.isEmpty()){ // no notifications found
                return  ResponseHandler.generateResponse(
                        "No notification record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    notifications
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

    //get single notification
    @GetMapping("/{id}")
    public ResponseEntity<Object> getNotification(@PathVariable("id") long id){
        try{
            //find notification by id
            Optional<Notification> optionalNotification = notificationRepository.findById(id);
            //notification found
            return optionalNotification.map(notification -> ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    notification
            )).orElseGet(() -> ResponseHandler.generateResponse(
                    "Notification with id " + id + " not found",
                    HttpStatus.NOT_FOUND,
                    null
            ));
            //notification not found
        }catch (Exception e){
            e.printStackTrace();
            return ResponseHandler.generateResponse(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    null
            );
        }
    }

    //create notification
    @PostMapping()
    public ResponseEntity<Object> createNotification(@Valid @RequestBody NotificationRequest requestData){
        try{
            //find staff
            Optional<Staff> optionalStaff = staffRepository.findById(requestData.getStaffId());

            if(optionalStaff.isPresent()) {
                //get data
                Notification notification = new Notification();
                populateNotification(notification, requestData);
                notification.setCreatedAt(new Date());
                notification.setUpdateAt(new Date());

                //save notification
                Notification _notification = notificationRepository.save(notification);

                return ResponseHandler.generateResponse(
                        "Notification was posted successful.",
                        HttpStatus.OK,
                        _notification
                );
            }
            return ResponseHandler.generateResponse(
                    "Error. Could not post notification. Student/Staff/Project not found.",
                    HttpStatus.OK,
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

    //update notification
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateNotification(@PathVariable("id") long id, @Valid @RequestBody NotificationRequest requestData){
        try{
            //find notification by id
            Optional<Notification> optionalNotification = notificationRepository.findById(id);
            if(optionalNotification.isPresent()) { //notification found

                Notification notification = optionalNotification.get();
                populateNotification(notification, requestData);
                notification.setUpdateAt(new Date());

                //save notification
                Notification _notification = notificationRepository.save(notification);

                return ResponseHandler.generateResponse(
                        "Notification details updated successful.",
                        HttpStatus.OK,
                        _notification
                );
            }
            //notification not found
            return ResponseHandler.generateResponse(
                    "Notification with id " + id + " not found",
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

    protected void populateNotification( Notification notification, NotificationRequest requestData){
        notification.setMessage( requestData.getMessage());
        notification.setTitle(requestData.getTitle());
        notification.setStaffId(requestData.getStaffId());
        notification.setType(NotificationTypes.valueOf( requestData.getType()));
    }

    // get all notifications by type
    @GetMapping("/type/{type}")
    public ResponseEntity<Object> getAllNotificationsByType(@PathVariable("type") String type){
        try{
            //empty array list of notifications
            List<Notification> notifications = new ArrayList<>();
            //get notifications and populate the array list
            notificationRepository.findAllByType( NotificationTypes.valueOf(type)).forEach( notifications::add);
            if(notifications.isEmpty()){ // no notifications found
                return  ResponseHandler.generateResponse(
                        "No Notification record was found",
                        HttpStatus.NOT_FOUND,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    null,
                    HttpStatus.OK,
                    notifications
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

    //delete notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteNotification(@PathVariable("id") long id){
        try{
            //find notification
            Optional<Notification> optionalNotification = notificationRepository.findById(id);
            if(optionalNotification.isPresent()){//notification found
                notificationRepository.delete(optionalNotification.get());
                return  ResponseHandler.generateResponse(
                        null,
                        HttpStatus.NO_CONTENT,
                        null
                );
            }
            return ResponseHandler.generateResponse(
                    "Notification with id " + id + " not found",
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

    //delete all notifications
    @DeleteMapping()
    public ResponseEntity<Object> deleteAllNotifications(){
        try{
            notificationRepository.deleteAll();
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
