# EmbarkX - Complete System Architecture

## Single Comprehensive Architecture Diagram

This diagram represents the complete EmbarkX AI-Powered Fitness Tracking Platform architecture in a single view.

```mermaid
graph TB
    subgraph "CLIENT LAYER"
        style CLIENT fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
        
        USER[👤 User/Browser]
        
        subgraph "React Frontend - Port 5173"
            REACT[React 19.2.0 + Vite 7.2.4]
            COMPONENTS[Components Layer<br/>Header | Forms | Lists | Detail]
            REDUX[Redux Toolkit<br/>State Management]
            APISERVICE[API Service Layer<br/>Axios Interceptors]
            
            REACT --> COMPONENTS
            REACT --> REDUX
            REACT --> APISERVICE
        end
        
        USER --> REACT
    end
    
    subgraph "SECURITY & AUTHENTICATION LAYER"
        style SECURITY fill:#e74c3c,stroke:#c0392b,stroke-width:3px,color:#fff
        
        KEYCLOAK[🔐 Keycloak OAuth2 Server<br/>Port: 8181<br/>Realm: fitness-oAuth2]
        OAUTH[OAuth2 PKCE Flow<br/>Authorization Code + Challenge]
        JWT[JWT Token Management<br/>Access & Refresh Tokens]
        
        KEYCLOAK --> OAUTH
        KEYCLOAK --> JWT
    end
    
    subgraph "API GATEWAY & SERVICE DISCOVERY"
        style GATEWAY fill:#3498db,stroke:#2980b9,stroke-width:3px,color:#fff
        
        subgraph "Spring Cloud Gateway - Port 8080"
            GATEWAY_MAIN[API Gateway]
            ROUTES[Route Predicates<br/>/users/* → User Service<br/>/activities/* → Activity Service<br/>/ai/* → AI Service]
            FILTERS[Filter Chain<br/>Auth | CORS | Logging]
            LB[Load Balancer<br/>Round Robin]
            
            GATEWAY_MAIN --> ROUTES
            GATEWAY_MAIN --> FILTERS
            GATEWAY_MAIN --> LB
        end
        
        EUREKA[🎯 Eureka Service Discovery<br/>Port: 8761<br/>Service Registry & Health Checks]
        
        CONFIG[⚙️ Config Server<br/>Port: 8888<br/>Centralized Configuration]
    end
    
    subgraph "MICROSERVICES LAYER"
        style SERVICES fill:#2ecc71,stroke:#27ae60,stroke-width:3px,color:#fff
        
        subgraph "User Service - Port 8081"
            US_CTRL[UserController<br/>REST Endpoints]
            US_SRV[UserService<br/>Business Logic]
            US_REPO[UserRepository<br/>Data Access Layer]
            US_ENTITY[User Entity<br/>JPA Mapping]
            
            US_CTRL --> US_SRV
            US_SRV --> US_REPO
            US_REPO --> US_ENTITY
        end
        
        subgraph "Activity Service - Port 8082"
            AS_CTRL[ActivityController<br/>REST Endpoints]
            AS_SRV[ActivityService<br/>Business Logic]
            AS_REPO[ActivityRepository<br/>Data Access Layer]
            AS_DOC[Activity Document<br/>MongoDB Model]
            AS_PUB[Event Publisher<br/>RabbitMQ Producer]
            
            AS_CTRL --> AS_SRV
            AS_SRV --> AS_REPO
            AS_REPO --> AS_DOC
            AS_SRV --> AS_PUB
        end
        
        subgraph "AI Service - Port 8083"
            AI_CTRL[AIController<br/>REST Endpoints]
            AI_SRV[AIService<br/>Recommendation Engine]
            AI_GEMINI[GeminiService<br/>AI Integration]
            AI_REPO[AIRepository<br/>Data Access Layer]
            AI_SUB[Event Listener<br/>RabbitMQ Consumer]
            
            AI_CTRL --> AI_SRV
            AI_SRV --> AI_GEMINI
            AI_SRV --> AI_REPO
            AI_SUB --> AI_SRV
        end
    end
    
    subgraph "MESSAGE QUEUE LAYER"
        style MQ fill:#f39c12,stroke:#e67e22,stroke-width:3px,color:#fff
        
        RABBIT[🐰 RabbitMQ - Port 5672]
        EXCHANGE[Exchange: fitness.exchange<br/>Type: Topic]
        QUEUE[Queue: activity.queue<br/>Durable: true]
        BINDING[Binding: routing.key.activity]
        
        RABBIT --> EXCHANGE
        EXCHANGE --> BINDING
        BINDING --> QUEUE
    end
    
    subgraph "DATA PERSISTENCE LAYER"
        style DATA fill:#9b59b6,stroke:#8e44ad,stroke-width:3px,color:#fff
        
        POSTGRES[(🐘 PostgreSQL<br/>Port: 5432<br/>Database: fitness_user_db<br/><br/>Tables:<br/>├─ users<br/>├─ roles<br/>├─ user_roles<br/>└─ user_profiles)]
        
        MONGO[(🍃 MongoDB<br/>Port: 27017<br/><br/>Activity Database:<br/>├─ activities<br/>└─ activity_sequences<br/><br/>AI Database:<br/>├─ ai_recommendations<br/>└─ analysis_history)]
    end
    
    subgraph "EXTERNAL SERVICES"
        style EXTERNAL fill:#34495e,stroke:#2c3e50,stroke-width:3px,color:#fff
        
        GEMINI[🤖 Google Gemini API<br/>AI-Powered Analysis<br/>Workout Recommendations<br/>Safety Tips & Form Correction]
    end
    
    %% Client to Security
    USER -.->|1. Login Request| KEYCLOAK
    KEYCLOAK -.->|2. Auth Code| REACT
    REACT -.->|3. Token Exchange| KEYCLOAK
    KEYCLOAK -.->|4. JWT Tokens| REACT
    
    %% Frontend to Gateway
    APISERVICE ==>|5. API Calls<br/>Bearer Token| GATEWAY_MAIN
    
    %% Gateway to Services
    LB ==>|6a. Route /users/*| US_CTRL
    LB ==>|6b. Route /activities/*| AS_CTRL
    LB ==>|6c. Route /ai/*| AI_CTRL
    
    %% Service Discovery
    US_CTRL -.->|Register & Heartbeat| EUREKA
    AS_CTRL -.->|Register & Heartbeat| EUREKA
    AI_CTRL -.->|Register & Heartbeat| EUREKA
    GATEWAY_MAIN -.->|Discover Services| EUREKA
    
    %% Configuration
    US_CTRL -.->|Fetch Config| CONFIG
    AS_CTRL -.->|Fetch Config| CONFIG
    AI_CTRL -.->|Fetch Config| CONFIG
    GATEWAY_MAIN -.->|Fetch Config| CONFIG
    
    %% Services to Databases
    US_REPO ==>|7a. SQL Queries<br/>CRUD Operations| POSTGRES
    AS_REPO ==>|7b. NoSQL Operations<br/>Document Storage| MONGO
    AI_REPO ==>|7c. Store Analysis<br/>Recommendations| MONGO
    
    %% Event-Driven Flow
    AS_PUB ==>|8. Publish Event<br/>ActivityCreatedEvent| EXCHANGE
    QUEUE ==>|9. Consume Event| AI_SUB
    
    %% AI Integration
    AI_GEMINI ==>|10. API Request<br/>Activity Analysis| GEMINI
    GEMINI ==>|11. AI Response<br/>Recommendations| AI_GEMINI
    
    %% Response Flow
    POSTGRES -.->|Response Data| US_REPO
    MONGO -.->|Response Data| AS_REPO
    MONGO -.->|Response Data| AI_REPO
    US_SRV -.->|Response| GATEWAY_MAIN
    AS_SRV -.->|Response| GATEWAY_MAIN
    AI_SRV -.->|Response| GATEWAY_MAIN
    GATEWAY_MAIN -.->|12. JSON Response| APISERVICE
    REDUX -.->|13. Update State| COMPONENTS
    COMPONENTS -.->|14. Render UI| USER
    
    %% Styling
    classDef frontend fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    classDef security fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff
    classDef gateway fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    classDef service fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    classDef message fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    classDef database fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff
    classDef external fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:#fff
    
    class USER,REACT,COMPONENTS,REDUX,APISERVICE frontend
    class KEYCLOAK,OAUTH,JWT security
    class GATEWAY_MAIN,ROUTES,FILTERS,LB,EUREKA,CONFIG gateway
    class US_CTRL,US_SRV,US_REPO,US_ENTITY,AS_CTRL,AS_SRV,AS_REPO,AS_DOC,AS_PUB,AI_CTRL,AI_SRV,AI_GEMINI,AI_REPO,AI_SUB service
    class RABBIT,EXCHANGE,QUEUE,BINDING message
    class POSTGRES,MONGO database
    class GEMINI external
```

---

## Architecture Flow Description

### **Complete Request-Response Cycle:**

#### **Phase 1: Authentication (Steps 1-4)**
1. User initiates login through React frontend
2. Keycloak OAuth2 returns authorization code
3. Frontend exchanges code for tokens using PKCE
4. JWT tokens stored in localStorage

#### **Phase 2: API Request (Steps 5-6)**
5. User action triggers API call with Bearer token
6. API Gateway routes request to appropriate microservice:
   - `/users/*` → User Service (Port 8081)
   - `/activities/*` → Activity Service (Port 8082)
   - `/ai/*` → AI Service (Port 8083)

#### **Phase 3: Data Processing (Steps 7-8)**
7. Microservices interact with databases:
   - User Service → PostgreSQL (relational data)
   - Activity Service → MongoDB (document storage)
   - AI Service → MongoDB (recommendations)
8. Activity Service publishes events to RabbitMQ

#### **Phase 4: AI Processing (Steps 9-11)**
9. AI Service consumes events from message queue
10. Gemini API analyzes workout data
11. AI recommendations stored in MongoDB

#### **Phase 5: Response (Steps 12-14)**
12. Gateway forwards response to frontend
13. Redux updates application state
14. Components re-render with new data

---

## Key Architecture Features

### **🎯 Microservices Pattern**
- **Service Independence**: Each service can be deployed separately
- **Technology Flexibility**: Different databases per service
- **Scalability**: Horizontal scaling capability

### **🔐 Security**
- **OAuth2 PKCE**: Most secure flow for SPAs
- **JWT Tokens**: Stateless authentication
- **API Gateway**: Centralized security enforcement

### **🚀 Performance**
- **Load Balancing**: Round-robin distribution
- **Service Discovery**: Dynamic service location
- **Event-Driven**: Asynchronous processing

### **📊 Data Management**
- **Polyglot Persistence**: PostgreSQL + MongoDB
- **Event Sourcing**: RabbitMQ messaging
- **Data Consistency**: ACID (PostgreSQL) + BASE (MongoDB)

### **🤖 AI Integration**
- **Google Gemini**: Advanced AI analysis
- **Asynchronous Processing**: Non-blocking operations
- **Recommendation Engine**: Personalized insights

---

## Technology Stack

| Layer | Technology | Version | Port |
|-------|-----------|---------|------|
| **Frontend** | React | 19.2.0 | 5173 |
| | Vite | 7.2.4 | - |
| | Material-UI | 7.3.6 | - |
| | Redux Toolkit | 2.11.1 | - |
| **Security** | Keycloak | 23+ | 8181 |
| **Gateway** | Spring Cloud Gateway | 4.1.0 | 8080 |
| **Discovery** | Eureka Server | 4.1.0 | 8761 |
| **Config** | Config Server | 4.1.0 | 8888 |
| **Services** | Spring Boot | 3.5.8 | 8081-8083 |
| | Java | 21 | - |
| **Messaging** | RabbitMQ | 3.12+ | 5672 |
| **Databases** | PostgreSQL | 15+ | 5432 |
| | MongoDB | 6.0+ | 27017 |
| **AI** | Google Gemini | 2.0 | - |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│              Docker Compose Environment              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Infrastructure:                                     │
│  ├─ PostgreSQL Container (5432)                     │
│  ├─ MongoDB Container (27017)                       │
│  ├─ RabbitMQ Container (5672)                       │
│  └─ Keycloak Container (8181)                       │
│                                                       │
│  Spring Cloud:                                       │
│  ├─ Eureka Server (8761)                            │
│  ├─ Config Server (8888)                            │
│  └─ API Gateway (8080)                              │
│                                                       │
│  Microservices:                                      │
│  ├─ User Service (8081)                             │
│  ├─ Activity Service (8082)                         │
│  └─ AI Service (8083)                               │
│                                                       │
│  Frontend:                                           │
│  └─ React Application (5173)                        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Architecture Highlights

### ✨ **Scalability**
- Each microservice can scale independently
- Load balancing across multiple instances
- Horizontal scaling support

### ✨ **Resilience**
- Service discovery for failover
- Circuit breaker pattern (future)
- Health monitoring

### ✨ **Maintainability**
- Clear separation of concerns
- Centralized configuration
- Standardized API patterns

### ✨ **Security**
- OAuth2 PKCE flow
- JWT token validation
- Encrypted communication

### ✨ **Performance**
- Asynchronous event processing
- Database optimization
- Caching strategies (future)

---

## How to Use This Diagram

### **For GitHub/Documentation:**
Copy the Mermaid code into your README.md or documentation files. GitHub and most modern documentation platforms will render it automatically.

### **For Presentations:**
1. Open [Mermaid Live Editor](https://mermaid.live/)
2. Paste the code
3. Export as PNG/SVG
4. Use in PowerPoint/Google Slides

### **For VS Code:**
Install "Markdown Preview Mermaid Support" extension to preview directly in VS Code.

### **For LinkedIn:**
Export as image and upload to your project section with the architecture description.

---

## Legend

**Line Types:**
- **Solid Arrow (==>)**: Main data flow / API calls
- **Dotted Arrow (-.->)**: Service registration / configuration / responses
- **Thick Lines**: Primary communication paths

**Colors:**
- 🟪 **Purple**: Client/Frontend Layer
- 🟥 **Red**: Security/Authentication
- 🟦 **Blue**: API Gateway & Infrastructure
- 🟩 **Green**: Microservices
- 🟧 **Orange**: Message Queue
- 🟣 **Dark Purple**: Databases
- ⬛ **Dark Gray**: External Services

**Icons:**
- 👤 User/Browser
- 🔐 Security/Authentication
- 🎯 Service Discovery
- ⚙️ Configuration
- 🐰 Message Queue
- 🐘 PostgreSQL
- 🍃 MongoDB
- 🤖 AI Service

---

## Project Information

**Project Name:** EmbarkX - AI-Powered Fitness Tracking Platform  
**Architecture Type:** Microservices with Event-Driven Processing  
**Version:** 1.0  
**Date:** December 24, 2025  
**Author:** [Your Name]  

---

**This single diagram provides a complete overview of the entire system architecture, showing all components, their interactions, and the complete data flow from user action to AI-powered response.**
