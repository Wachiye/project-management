package com.egerton.projectmanagement.utils;

import org.mindrot.jbcrypt.BCrypt;

import java.util.Random;

public class Password {
    // encrypts a plain text password
    public static String hashpwd( String plainText){
        return BCrypt.hashpw( plainText, BCrypt.gensalt());
    }
    // compare plain text to hashed password
    public static boolean checkpw( String plainText, String hashedPassword){
        if( BCrypt.checkpw(plainText, hashedPassword))
            return true;
        return false;
    }

    public static String getRandomPassword(){
        int lowerBound = 48; // letter a
        int upperBound = 122; // letter Z;
        int passLength = 8; // length of password;

        Random random = new Random();

        String randomPass = random.ints( lowerBound, upperBound +1)
                .filter( i -> ( i <= 57 || i >= 65) && (i <= 90 || i >=97))
                .limit(passLength)
                .collect( StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        return randomPass;
    }
}
