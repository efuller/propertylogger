# Modules
This directory contains all the modules of the application. Each module is a directory that contains all the files
related to a specific feature of the application.

Each folder can contain functionality that sit at each layer of the architecture.

## Explicit Folder Structure
In an effort to help solidify my mental model of thinking in layers, I've chosen to create subdirectories for each layer.

```
├── modules
│   ├── auth
│   │   ├── adapters
│   │   ├── application
│   │   ├── domain
│   │   ├── infra
```