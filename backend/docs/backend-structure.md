# Module Structure & Dependencies

## Code and Directory Structure
```bash
├── app/                          # Main application folder
│   ├── __init__.py               # Marks the folder as a Python module
│   ├── main.py                   # Entry point for the FastAPI app
│   ├── core/                     # Core configurations and utilities
│   │   ├── __init__.py
│   │   ├── config.py             # App-wide settings (e.g., ENV variables)
│   │   ├── security.py           # Authentication and security logic
│   │   └── middleware.py         # Custom middleware
│   ├── modules/                  # Functional modules
│   │   ├── auth/                 # Authentication & user management
│   │   │   ├── users/               # User management
│   │   │   │   ├── models.py            # User model
│   │   │   │   ├── repository.py
│   │   │   │   └── services.py          # User-specific operations
│   │   │   └── sessions/               # Session management
│   │   │   │   ├── models.py            # Session model
│   │   │   │   ├── repository.py
│   │   │   │   └── services.py          # Session-specific operations
│   ├── db/                       # Database setup and migrations
│   │   ├── __init__.py
│   │   ├── base.py               # SQLAlchemy Base class
│   │   ├── session.py            # Database session logic
│   │   └── migrations/           # Alembic migrations
│   ├── utils/                    # Shared utilities across modules
│   │   ├── __init__.py
│   │   ├── common.py             # General-purpose helpers
│   │   ├── email.py              # Email-related utilities
│   │   └── ...                   
├── .env                          # Environment variables (backend-specific)
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Dockerfile for backend deployment
├── docker-compose.yml            # Docker Compose file (if needed)
└── README.md                     # Backend-specific documentation
```

## Core Modules

### 1. Auth Module
**Responsibilities:**
- User authentication & authorization
- User profile management
- Password management
- Session handling

**Dependencies:**
- Can only depend on core utilities
- Must not depend on other modules
- Other modules can depend on auth
