# EmbarkX Architecture - Mermaid Diagrams

Complete architecture diagrams using Mermaid syntax for GitHub and documentation.

---

## 1. Overall System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Port: 5173]
    end
    
    subgraph "Security Layer"
        B[Keycloak OAuth2<br/>Port: 8181]
    end
    
    subgraph "API Gateway Layer"
        C[Spring Cloud Gateway<br/>Port: 8080]
    end
    
    subgraph "Service Discovery"
        D[Eureka Server<br/>Port: 8761]
    end
    
    subgraph "Configuration"
        E[Config Server<br/>Port: 8888]
    end
    
    subgraph "Microservices"
        F[User Service<br/>Port: 8081]
        G[Activity Service<br/>Port: 8082]
        H[AI Service<br/>Port: 8083]
    end
    
    subgraph "Message Queue"
        I[RabbitMQ<br/>Port: 5672]
    end
    
    subgraph "Databases"
        J[(PostgreSQL<br/>Port: 5432)]
        K[(MongoDB<br/>Port: 27017)]
    end
    
    subgraph "External Services"
        L[Google Gemini API]
    end
    
    A -->|OAuth2 PKCE| B
    A -->|HTTPS| C
    C -->|Route| F
    C -->|Route| G
    C -->|Route| H
    F -.->|Register| D
    G -.->|Register| D
    H -.->|Register| D
    C -.->|Discover| D
    F -.->|Config| E
    G -.->|Config| E
    H -.->|Config| E
    F -->|Store| J
    G -->|Store| K
    H -->|Store| K
    G -->|Publish| I
    H -->|Consume| I
    H -->|API Call| L
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style B fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    style C fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    style F fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style G fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style H fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
```

---

## 2. Microservices Architecture Detailed

```mermaid
graph LR
    subgraph "Frontend Application"
        A1[React Components]
        A2[Redux Store]
        A3[API Services]
        A1 --> A2
        A2 --> A3
    end
    
    subgraph "API Gateway"
        B1[Route Predicates]
        B2[Filters]
        B3[Load Balancer]
        B1 --> B2
        B2 --> B3
    end
    
    subgraph "User Service"
        C1[Controllers]
        C2[Services]
        C3[Repositories]
        C4[Entities]
        C1 --> C2
        C2 --> C3
        C3 --> C4
    end
    
    subgraph "Activity Service"
        D1[Controllers]
        D2[Services]
        D3[Repositories]
        D4[Documents]
        D5[Event Publisher]
        D1 --> D2
        D2 --> D3
        D3 --> D4
        D2 --> D5
    end
    
    subgraph "AI Service"
        E1[Controllers]
        E2[AI Service]
        E3[Gemini Service]
        E4[Repositories]
        E5[Event Listener]
        E1 --> E2
        E2 --> E3
        E2 --> E4
        E5 --> E2
    end
    
    A3 -->|HTTP/HTTPS| B1
    B3 -->|/users/*| C1
    B3 -->|/activities/*| D1
    B3 -->|/ai/*| E1
    D5 -.->|Events| E5
    
    style A1 fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style B1 fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    style C1 fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style D1 fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style E1 fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
```

---

## 3. OAuth2 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User/Browser
    participant R as React Frontend
    participant K as Keycloak OAuth2
    participant G as API Gateway
    participant S as User Service
    
    U->>R: Click Login
    R->>R: Generate Code Verifier
    R->>R: Generate Code Challenge
    R->>K: Redirect to /auth?code_challenge
    K->>U: Show Login Page
    U->>K: Enter Credentials
    K->>K: Validate Credentials
    K->>R: Redirect with Auth Code
    R->>K: POST /token (code + verifier)
    K->>K: Verify Code & Challenge
    K->>R: Return Access Token + Refresh Token
    R->>R: Store Tokens in localStorage
    
    Note over R,S: Authenticated API Calls
    R->>G: API Request with Bearer Token
    G->>G: Validate JWT Token
    G->>S: Forward Request with User Info
    S->>S: Process Request
    S->>G: Response
    G->>R: Response
    R->>U: Display Data
```

---

## 4. Activity Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as React Frontend
    participant G as API Gateway
    participant AS as Activity Service
    participant DB as MongoDB
    participant MQ as RabbitMQ
    participant AI as AI Service
    participant GM as Gemini API
    
    U->>F: Submit Activity Form
    F->>F: Validate Input
    F->>G: POST /activities
    G->>AS: Route to Activity Service
    AS->>AS: Create Activity Object
    AS->>DB: Save Activity
    DB->>AS: Activity Saved (with ID)
    AS->>MQ: Publish ActivityCreatedEvent
    AS->>G: Return Activity Response
    G->>F: Success Response
    F->>U: Show Success Message
    
    Note over MQ,AI: Asynchronous Processing
    MQ->>AI: Deliver Event to Listener
    AI->>AI: Process Activity Data
    AI->>GM: Request Analysis
    GM->>AI: Return AI Recommendations
    AI->>DB: Save AI Analysis
    AI->>AI: Log Processing Complete
```

---

## 5. Service Discovery Flow

```mermaid
sequenceDiagram
    participant S as Service Instance
    participant E as Eureka Server
    participant G as API Gateway
    participant C as Client Request
    
    Note over S,E: Service Registration
    S->>E: Register Service on Startup
    E->>E: Store Service Metadata
    E->>S: Registration Confirmed
    
    loop Every 30 seconds
        S->>E: Send Heartbeat
        E->>E: Update Service Status
    end
    
    Note over G,C: Service Discovery
    C->>G: Incoming Request
    G->>E: Query Available Service Instances
    E->>G: Return Service List
    G->>G: Load Balance (Round Robin)
    G->>S: Forward Request to Instance
    S->>G: Response
    G->>C: Return Response
```

---

## 6. Component Architecture Diagram

```mermaid
graph TB
    subgraph "React Frontend"
        direction TB
        FG[/"Main Components"/]
        FG1[App.jsx]
        FG2[Header Component]
        FG3[Welcome Section]
        FG4[Activity Page]
        FG5[Activity Form]
        FG6[Activity List]
        FG7[Activity Detail]
        
        FS[/"Services"/]
        FS1[API Service]
        FS2[Auth Service]
        
        FST[/"State Management"/]
        FST1[Redux Store]
        FST2[Actions]
        FST3[Reducers]
        
        FG --> FG1
        FG1 --> FG2
        FG1 --> FG3
        FG1 --> FG4
        FG4 --> FG5
        FG4 --> FG6
        FG1 --> FG7
        
        FG1 --> FS
        FS --> FS1
        FS --> FS2
        
        FG1 --> FST
        FST --> FST1
        FST1 --> FST2
        FST1 --> FST3
    end
    
    subgraph "API Gateway"
        GW[Spring Cloud Gateway]
        GW1[Route Configuration]
        GW2[Filter Chain]
        GW3[Load Balancer]
        
        GW --> GW1
        GW --> GW2
        GW --> GW3
    end
    
    subgraph "User Service"
        US[User Service]
        USC[UserController]
        USS[UserService]
        USR[UserRepository]
        USE[User Entity]
        
        US --> USC
        USC --> USS
        USS --> USR
        USR --> USE
    end
    
    subgraph "Activity Service"
        AS[Activity Service]
        ASC[ActivityController]
        ASS[ActivityService]
        ASR[ActivityRepository]
        ASD[Activity Document]
        ASP[Event Publisher]
        
        AS --> ASC
        ASC --> ASS
        ASS --> ASR
        ASR --> ASD
        ASS --> ASP
    end
    
    subgraph "AI Service"
        AIS[AI Service]
        AISC[AIController]
        AISS[AIService]
        AISG[GeminiService]
        AISR[AIRepository]
        AISL[Event Listener]
        
        AIS --> AISC
        AISC --> AISS
        AISS --> AISG
        AISS --> AISR
        AISL --> AISS
    end
    
    FS1 -->|HTTP/HTTPS| GW
    GW3 -->|Route| USC
    GW3 -->|Route| ASC
    GW3 -->|Route| AISC
    ASP -.->|RabbitMQ| AISL
    
    style FG fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style GW fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    style US fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style AS fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style AIS fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
```

---

## 7. Data Flow Diagram

```mermaid
flowchart TD
    Start([User Action]) --> A{Authenticated?}
    A -->|No| B[Redirect to Keycloak]
    B --> C[OAuth2 Login]
    C --> D[Receive Tokens]
    D --> E[Store in localStorage]
    E --> F[Redirect to App]
    
    A -->|Yes| G[Make API Request]
    F --> G
    
    G --> H[API Gateway]
    H --> I{Service Discovery}
    I --> J[User Service]
    I --> K[Activity Service]
    I --> L[AI Service]
    
    J --> M[(PostgreSQL)]
    K --> N[(MongoDB)]
    L --> N
    
    K --> O[Publish Event]
    O --> P[RabbitMQ]
    P --> Q[AI Service Listener]
    Q --> R[Gemini API]
    R --> S[Generate Recommendations]
    S --> N
    
    M --> T[Response]
    N --> T
    T --> H
    H --> U[React Frontend]
    U --> V([Display to User])
    
    style Start fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style V fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style A fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    style I fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
```

---

## 8. Deployment Architecture

```mermaid
graph TB
    subgraph "Docker Compose Environment"
        subgraph "Infrastructure Services"
            PG[(PostgreSQL<br/>Container)]
            MG[(MongoDB<br/>Container)]
            RMQ[RabbitMQ<br/>Container]
            KC[Keycloak<br/>Container]
        end
        
        subgraph "Spring Cloud Services"
            EUR[Eureka Server<br/>Container]
            CFG[Config Server<br/>Container]
            GTW[API Gateway<br/>Container]
        end
        
        subgraph "Business Services"
            USR[User Service<br/>Container]
            ACT[Activity Service<br/>Container]
            AIS[AI Service<br/>Container]
        end
        
        subgraph "Frontend"
            FE[React App<br/>Container]
        end
    end
    
    FE -->|Auth| KC
    FE -->|API Calls| GTW
    GTW -.->|Discover| EUR
    USR -.->|Register| EUR
    ACT -.->|Register| EUR
    AIS -.->|Register| EUR
    GTW -.->|Config| CFG
    USR -.->|Config| CFG
    ACT -.->|Config| CFG
    AIS -.->|Config| CFG
    GTW -->|Route| USR
    GTW -->|Route| ACT
    GTW -->|Route| AIS
    USR -->|Data| PG
    ACT -->|Data| MG
    AIS -->|Data| MG
    ACT -->|Events| RMQ
    AIS -->|Listen| RMQ
    
    style FE fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style GTW fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    style USR fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style ACT fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style AIS fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
```

---

## 9. Database Schema Diagram

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned
    USERS ||--o| USER_PROFILES : has
    
    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar keycloak_id UK
        timestamp created_at
        timestamp updated_at
    }
    
    ROLES {
        bigint id PK
        varchar name UK
    }
    
    USER_ROLES {
        bigint user_id FK
        bigint role_id FK
    }
    
    USER_PROFILES {
        bigint id PK
        bigint user_id FK
        decimal height
        decimal weight
        integer age
        varchar fitness_goal
    }
    
    ACTIVITIES {
        objectid _id PK
        string activityId UK
        string userId
        string activityType
        integer duration
        integer calories
        string intensity
        double distance
        string notes
        date createdAt
        date updatedAt
    }
    
    AI_RECOMMENDATIONS {
        objectid _id PK
        string activityId FK
        string userId
        object analysis
        string geminiResponse
        double confidence
        date generatedAt
    }
    
    ACTIVITIES ||--o| AI_RECOMMENDATIONS : generates
```

---

## 10. Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        L1[OAuth2 PKCE Flow]
        L2[JWT Token Validation]
        L3[API Gateway Security]
        L4[Service Level Security]
        L5[Data Encryption]
    end
    
    subgraph "Authentication Flow"
        A1[User Login]
        A2[Code Challenge]
        A3[Authorization Code]
        A4[Token Exchange]
        A5[Access Token]
        A6[Refresh Token]
    end
    
    subgraph "Authorization"
        B1[Role-Based Access]
        B2[Resource Permissions]
        B3[Method Security]
    end
    
    subgraph "Data Protection"
        C1[HTTPS/TLS]
        C2[Database Encryption]
        C3[Secrets Management]
    end
    
    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> A5
    A4 --> A6
    
    L1 --> A1
    L2 --> A5
    L3 --> B1
    L4 --> B3
    L5 --> C2
    
    A5 --> B1
    B1 --> B2
    B2 --> B3
    
    style L1 fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff
    style L2 fill:#e67e22,stroke:#d35400,stroke-width:2px,color:#fff
    style L3 fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    style L4 fill:#f1c40f,stroke:#f39c12,stroke-width:2px,color:#fff
    style L5 fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
```

---

## 11. Event-Driven Architecture

```mermaid
flowchart LR
    subgraph "Activity Service"
        A1[Activity Controller]
        A2[Activity Service]
        A3[Event Publisher]
    end
    
    subgraph "Message Queue"
        MQ1[Exchange<br/>fitness.exchange]
        MQ2[Queue<br/>activity.queue]
        MQ3[Binding]
    end
    
    subgraph "AI Service"
        AI1[Event Listener]
        AI2[AI Service]
        AI3[Gemini API]
        AI4[Repository]
    end
    
    A1 --> A2
    A2 --> A3
    A3 -->|Publish| MQ1
    MQ1 --> MQ3
    MQ3 --> MQ2
    MQ2 -->|Consume| AI1
    AI1 --> AI2
    AI2 --> AI3
    AI3 --> AI2
    AI2 --> AI4
    
    style A1 fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style MQ1 fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    style AI1 fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
```

---

## 12. CI/CD Pipeline

```mermaid
flowchart TD
    A[Developer Push] --> B[GitHub/GitLab]
    B --> C{CI Pipeline Trigger}
    
    C --> D[Checkout Code]
    D --> E[Build Phase]
    E --> E1[Maven Build]
    E --> E2[NPM Build]
    
    E1 --> F[Test Phase]
    E2 --> F
    F --> F1[Unit Tests]
    F --> F2[Integration Tests]
    F --> F3[API Tests]
    
    F1 --> G[Quality Check]
    F2 --> G
    F3 --> G
    G --> G1[SonarQube]
    G --> G2[Security Scan]
    G --> G3[Code Coverage]
    
    G1 --> H{Tests Pass?}
    G2 --> H
    G3 --> H
    
    H -->|No| I[Notify Developer]
    H -->|Yes| J[Build Docker Images]
    
    J --> J1[Backend Images]
    J --> J2[Frontend Image]
    
    J1 --> K[Push to Registry]
    J2 --> K
    
    K --> L{Deploy Stage}
    L -->|Dev| M[Development Env]
    L -->|Staging| N[Staging Env]
    L -->|Prod| O{Manual Approval?}
    
    O -->|Yes| P[Production Env]
    O -->|No| Q[Wait for Approval]
    
    M --> R[Deployment Success]
    N --> R
    P --> R
    
    R --> S[Notify Team]
    I --> T[Fix Issues]
    
    style A fill:#667eea,stroke:#764ba2,stroke-width:2px,color:#fff
    style H fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    style R fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style I fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff
```

---

## 13. Monitoring & Observability

```mermaid
graph TB
    subgraph "Application Layer"
        A1[User Service]
        A2[Activity Service]
        A3[AI Service]
        A4[API Gateway]
    end
    
    subgraph "Logging"
        L1[Log Aggregator]
        L2[Log Storage]
        L3[Log Analysis]
    end
    
    subgraph "Metrics"
        M1[Prometheus]
        M2[Grafana]
        M3[Alerts]
    end
    
    subgraph "Tracing"
        T1[Distributed Tracing]
        T2[Trace Collector]
        T3[Trace Viewer]
    end
    
    subgraph "Health Checks"
        H1[Service Health]
        H2[Database Health]
        H3[Message Queue Health]
    end
    
    A1 --> L1
    A2 --> L1
    A3 --> L1
    A4 --> L1
    L1 --> L2
    L2 --> L3
    
    A1 --> M1
    A2 --> M1
    A3 --> M1
    A4 --> M1
    M1 --> M2
    M2 --> M3
    
    A1 --> T1
    A2 --> T1
    A3 --> T1
    T1 --> T2
    T2 --> T3
    
    A1 --> H1
    A2 --> H1
    A3 --> H1
    H1 --> H2
    H1 --> H3
    
    style L1 fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff
    style M1 fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff
    style T1 fill:#f39c12,stroke:#e67e22,stroke-width:2px,color:#fff
    style H1 fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff
```

---

## How to Use These Diagrams

### **In GitHub README:**
Simply paste the Mermaid code blocks into your README.md file, and GitHub will automatically render them.

### **In VS Code:**
Install the "Markdown Preview Mermaid Support" extension to preview diagrams.

### **Online Editors:**
- [Mermaid Live Editor](https://mermaid.live/)
- Copy and paste any diagram to edit and export

### **In Documentation:**
Most modern documentation tools (GitBook, Docusaurus, MkDocs) support Mermaid diagrams natively.

---

## Diagram Legend

**Colors Used:**
- 🟦 **Blue** (#3498db): Gateway, Infrastructure
- 🟩 **Green** (#2ecc71): Microservices, Success
- 🟪 **Purple** (#667eea): Frontend, Client
- 🟧 **Orange** (#f39c12): Security, Message Queue
- 🟥 **Red** (#e74c3c): Errors, Critical

**Arrow Types:**
- **Solid (→)**: Direct communication/call
- **Dotted (-.->)**: Service discovery/registration
- **Bold (==>)**: Main data flow

---

## Export Options

You can export these diagrams as:
- PNG/SVG images (using Mermaid Live Editor)
- PDF (for documentation)
- Embedded in HTML
- Included in Confluence/Notion

---

**Generated for EmbarkX AI Microservice Fitness Application**
**Date:** December 24, 2025
**Architecture Version:** 1.0
