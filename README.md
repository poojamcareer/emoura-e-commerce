📌 Overview

Emoura Backend is the server-side implementation of a full-stack e-commerce application.
It is built using Spring Boot and provides RESTful APIs to support core e-commerce features such as product listing, user authentication, cart operations, and order management.

This backend is designed to work with a separate frontend application and follows a clean, modular structure suitable for real-world applications.

⚙️ Tech Stack

Java

Spring Boot

Spring Web (REST APIs)

Maven

MySQL 

JPA / Hibernate

🧱 Project Structure
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com.emoura
│       │       ├── controller
│       │       ├── service
│       │       ├── repository
│       │       └── model
│       └── resources/
│           └── application.properties
├── pom.xml
├── .gitignore
└── README.md

🔗 API Features

User authentication & profile handling

Product management

Category-wise product listing

Cart operations

Order processing

RESTful API communication with frontend

▶️ Run the Application Locally
Prerequisites

Java 17+ (or compatible version)

Maven

MySQL (or configured DB)

Steps
mvn spring-boot:run


The backend server will start on:

http://localhost:8080

🛠️ Configuration

Update database credentials in:

src/main/resources/application.properties


Example:

spring.datasource.url=jdbc:mysql://localhost:3306/emoura
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

🧪 Testing

Basic API testing can be done using Postman

Test folder is optional and can be added for unit/integration tests

📌 Notes

This backend is part of a full-stack e-commerce project

Designed with scalability and clean separation of concerns

Frontend is maintained in a separate folder/repository

👩‍💻 Author

Pooja 
Aspiring Full-Stack Developer
