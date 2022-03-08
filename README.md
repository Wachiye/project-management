# Academic Project Approval & Management System Spring Boot Server

Academic Project Approval and Management System is a web-based software application.\
The main purpose of this system is to automate all the project-management operations in academics and create an effective and efficient platform for students and their project supervisors and evaluators to manage their academic projects.

## Technologies
Front-end: ReactJs, HTML, CSS, JavaScript, Bootstrap.\
Back-end (`REST API`): Java, Spring Boot,Java Servlets and MySQL

## Project Features

The major features of the **Academic Project Approval and Management System** are:
1. Registration of Students, Supervisors, and Evaluation committee members
2. Project Creation and Approval
3. Project Planning and Scheduling
4. Reporting and Analysis: generating timely reports
5. Project Documentation and File sharing: uploading and sharing of project documents
6. Communication: information sharing through email
7. Time and Progress tracking

## Prerequisites

To use this project locally, the following software are required to be installed
1. NodeJs
2. Java
3. Tomcat Server and Apache Maven
4. MySQL server

## Setting up Server Environment Variables
Check the env.sample file and add the following System Environment variables.\
*`MYSQL` is used as the database server*. There provide your mysql database url, username and password as values for `APAMS_DB_URL`, `APAMS_DB_USERNAME` and `APAMS_DB_PASSWORD` respectively.\

*`SMTP` is used as the mail server*. There provide your gmail email and password as values for `APAMS_MAIL_USERNAME` and `APAMS_MAIL_PASSWORD` respectively.\

`CLOUDINARY` has been used as the file server. Create account on cloudinary and copy the `API_KEY, API_SECRET, and CLOUD_NAME` to `APAMS_CLOUDINARY_KEY`, `APAMS_CLOUDINARY_KEY`, and `APAMS_CLOUDINARY_NAME` respectively.

1. APAMS_DB_URL
2. APAMS_DB_USERNAME
3. APAMS_DB_PASSWORD
4. APAMS_JWT_SECRET
5. APAMS_MAIL_USERNAME
6. APAMS_MAIL_PASSWORD
7. APAMS_CLOUDINARY_KEY
8. APAMS_CLOUDINARY_SECRET
9. APAMS_CLOUDINARY_NAME

## Running the server
run `mvn install` in the root directory of the project installation

## Credits
This project was created By [Wachiye Jeremiah Siranjofu](https://github.com/Wachiye). and contributed by [Rose Othiambo Atieno](https://github.com/Rose)