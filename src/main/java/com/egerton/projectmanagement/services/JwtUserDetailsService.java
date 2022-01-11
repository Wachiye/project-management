package com.egerton.projectmanagement.services;

import com.egerton.projectmanagement.models.UserModel;
import com.egerton.projectmanagement.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<UserModel> optionalUser = userRepository.findUserByEmail(email);
        if(optionalUser.isPresent()){
            UserModel user = optionalUser.get();

            return new User( user.getEmail(), user.getPassword(), new ArrayList<>());
        }
        else {
            throw new UsernameNotFoundException("Sorry. No User exists with email:" + email);
        }
    }
}
