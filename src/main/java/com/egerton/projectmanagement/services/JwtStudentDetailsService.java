package com.egerton.projectmanagement.services;

import com.egerton.projectmanagement.models.Student;
import com.egerton.projectmanagement.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@Primary
public class JwtStudentDetailsService implements UserDetailsService {
    @Autowired
    private StudentRepository studentRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Student> student = studentRepository.findStudentByEmail(email);
        if(student.isPresent()){
            return new User( student.get().getEmail(), student.get().getPassword(), new ArrayList<>());
        }
        else {
            throw new UsernameNotFoundException("No student exists with email:" + email);
        }
    }
}
