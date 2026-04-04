#  Cloud-Native AI English Polisher

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-web-services&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

##  Overview

An AI-powered English polishing web application built for non-native English speakers. By integrating a Large Language Model (LLM), it helps users instantly transform rough drafts into fluent, professional, native-level expression.

This project goes beyond a simple AI integration tool — it is an **enterprise-grade cloud-native practice**. Built full-stack and deployed entirely on AWS, with **100% Infrastructure-as-Code (IaC)** via Terraform, ensuring global low-latency access and excellent scalability.

##  Live Demo

 **Try it out here:** [https://d3w0l0fefqonl3.cloudfront.net/](https://d3w0l0fefqonl3.cloudfront.net/)

##  How it Works

1. **Input:** The user types a draft (Chinese, English, or mixed) into the intuitive React frontend.
2. **Routing:** The request travels through the CloudFront CDN accelerator network and is precisely directed to the backend API.
3. **Processing:** The FastAPI backend receives the request, constructs a precise prompt, and calls the LLM (Gemini API) for semantic analysis and rewriting.
4. **Output:** The system returns multiple tone-adjusted polishing results along with grammar analysis, helping users finalize their email or document.

##  AWS Architecture

```
                        ┌─────────────────────────────────────────────────────┐
                        │                   AWS Cloud                         │
   User (Browser)       │                                                     │
        │               │   ┌─────────────────────────────────────────────┐   │
        │  HTTPS         │   │             CloudFront CDN                  │   │
        └───────────────►│   │         (Global Edge Network)               │   │
                        │   │                                             │   │
                        │   │   Path: /*  (default) ──────────────────┐   │   │
                        │   │   Path: /api/* ──────────────────────┐  │   │   │
                        │   └──────────────────────────────────────│──│───┘   │
                        │                                          │  │       │
                        │          ┌───────────────────────────────┘  │       │
                        │          │  HTTP :80                        │       │
                        │          ▼                                  │       │
                        │   ┌─────────────┐          ┌───────────────┴────┐  │
                        │   │     ALB     │          │    S3 Bucket       │  │
                        │   │(public, :80)│          │ (React Static SPA) │  │
                        │   └──────┬──────┘          │  (private, OAC)    │  │
                        │          │ HTTP :8000       └────────────────────┘  │
                        │          │                                          │
                        │   ┌──────▼──────────────────────────────────────┐  │
                        │   │                VPC (10.0.0.0/16)            │  │
                        │   │                                              │  │
                        │   │  ┌─────────────────────────────────────┐    │  │
                        │   │  │       Public Subnets                │    │  │
                        │   │  │   us-east-1a        us-east-1b      │    │  │
                        │   │  │  10.0.101.0/24     10.0.102.0/24   │    │  │
                        │   │  │                                     │    │  │
                        │   │  │   ┌─────────────────────────────┐   │    │  │
                        │   │  │   │    ECS Fargate (Serverless) │   │    │  │
                        │   │  │   │   ┌─────────────────────┐   │   │    │  │
                        │   │  │   │   │  FastAPI Container   │   │   │    │  │
                        │   │  │   │   │    Port :8000        │   │   │    │  │
                        │   │  │   │   └──────────┬──────────┘   │   │    │  │
                        │   │  │   └──────────────│──────────────┘   │    │  │
                        │   │  └──────────────────│──────────────────┘    │  │
                        │   │                     │                        │  │
                        │   │         ┌───────────┴──────────┐            │  │
                        │   │         │                      │            │  │
                        │   │         ▼                      ▼            │  │
                        │   │  ┌─────────────┐    ┌──────────────────┐   │  │
                        │   │  │  CloudWatch │    │   ECR Registry   │   │  │
                        │   │  │    Logs     │    │  (Docker Images) │   │  │
                        │   │  └─────────────┘    └──────────────────┘   │  │
                        │   │                                              │  │
                        │   │         ┌──────────────────────┐            │  │
                        │   │         │   Parameter Store    │            │  │
                        │   │         │  (GEMINI_API_KEY ) │            │  │
                        │   │         └──────────────────────┘            │  │
                        │   └──────────────────────────────────────────┘  │  │
                        │                                                     │
                        │              ┌──────────────────────┐               │
                        │              │   IAM Roles          │               │
                        │              │  (Zero-Trust Policy) │               │
                        │              └──────────────────────┘               │
                        └─────────────────────────────────────────────────────┘
                                               │
                                               │ HTTPS (Gemini API)
                                               ▼
                                    ┌─────────────────────┐
                                    │   Google Gemini API  │
                                    │       (LLM)          │
                                    └─────────────────────┘
```

**Traffic flow summary:**

- `/*` → CloudFront → **S3** (React SPA, served via OAC)
- `/api/*` → CloudFront → **ALB** → **ECS Fargate** (FastAPI, port 8000)
- ECS outbound → **Gemini API** (via public IP, no NAT Gateway needed)
- Secrets injected at runtime from **SSM Parameter Store**

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (static SPA) |
| Backend | Python / FastAPI |
| Containerization | Docker / Amazon ECR |
| Compute | AWS ECS Fargate (Serverless) |
| Load Balancing | AWS Application Load Balancer (ALB) |
| CDN | AWS CloudFront |
| Static Hosting | AWS S3 |
| Secrets Management | AWS SSM Parameter Store |
| Observability | AWS CloudWatch Logs |
| IaC | Terraform |
| LLM | Google Gemini API |

## ☁️ Infrastructure Highlights

All infrastructure is automated and managed via **Terraform**, with a focus on high availability, global low latency (TTFB < 50ms), and cost optimization:

- **Frontend (Global Edge Caching):** Static assets (React build) are hosted on **Amazon S3** and distributed globally via **CloudFront CDN** edge nodes, delivering near-instant page loads worldwide.
- **Backend (Serverless Compute):** Dynamic API requests are received by an **Application Load Balancer (ALB)** and forwarded to a containerized FastAPI app running on **ECS Fargate** — no server management required, with elastic auto-scaling built in.
- **Security & Cost Optimization:** The entire system follows a **Zero-Trust** architecture, with strict VPC segmentation and Security Group rules that block all traffic not originating from the ALB. Network routing was further optimized to eliminate the expensive **NAT Gateway** dependency, significantly reducing operating costs.
