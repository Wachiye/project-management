package com.egerton.projectmanagement.services;

import com.egerton.projectmanagement.models.Email;
import com.egerton.projectmanagement.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import java.io.File;

@Service
public class EmailService {
    @Value(value="spring.mail.username")
    private String SYSTEM_EMAIL;
    @Autowired
    private JavaMailSender mailSender;

    public boolean sendPlainText( Email email){
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(email.getFrom());
            message.setReplyTo( email.getFrom());
            message.setTo( email.getTo());
            message.setSubject(email.getSubject());
            message.setText( email.getText());

            mailSender.send(message);
            return  true;
        } catch (Exception ex){
            ex.printStackTrace();
            return false;
        }
    }

    public boolean sendHtml(Email email){
        try{
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(email.getFrom(), email.getSenderName());

            if( email.getToMany() != null){
                helper.setTo( email.getToMany());
            } else{
                helper.setTo(email.getTo());
            }

            if( email.getCc() != null)
                helper.setCc(email.getCc());

            helper.setSubject(email.getSubject());
            helper.setText(email.getText(), true);

            //add attachments
            if( email.getAttachments() !=null)
                addAttachments( helper, email);

            mailSender.send( message);
            return true;
        } catch (Exception ex){
            ex.printStackTrace();
            return false;
        }
    }

    public void  sendVerificationCode(UserModel userModel, String verificationURL){
        //email
        Email email = new Email();
        email.setFrom( SYSTEM_EMAIL);
        email.setSenderName("APAMS EGERTON");
        email.setSubject("Registration Verification Is Required");
        email.setTo(userModel.getEmail());

        String verifyURL = verificationURL + userModel.getVerificationCode();

        String text = "<p> Dear " + userModel.getFullName() +", </p> " +
                "<p>Please click the link bellow to verify your registration.</p>" +
                "<h3><a href=\"" + verifyURL + "\">VERIFY</a> </h3>";
        text += "<p>Thank you. We hope that the online platform will help you manage your project effectively <br />" +
                "Good luck as you tackle your project. </p>";
        email.setText(text);

        email.setAttachments(null);

        sendHtml( email);

    }
    protected void addAttachments( MimeMessageHelper helper, Email email){
        email.getAttachments().forEach( attachment -> {
            FileSystemResource file = new FileSystemResource(new File(String.valueOf(attachment)));
            try {
                helper.addAttachment(file.getFilename(), file);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
    }
}
