# 🚀 Cloud-Native AI English Polisher

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
                        │          │  HTTPS (AllViewerExceptHostHeader)│       │
                        │          ▼                                  │       │
                        │   ┌──────────────────┐     ┌───────────────┴────┐  │
                        │   │  Lambda Function  │     │    S3 Bucket       │  │
                        │   │  URL (HTTPS only) │     │ (React Static SPA) │  │
                        │   └────────┬─────────┘     │  (private, OAC)    │  │
                        │            │                └────────────────────┘  │
                        │            ▼                                        │
                        │   ┌──────────────────────────────────────────────┐  │
                        │   │         AWS Lambda (Serverless)              │  │
                        │   │   ┌──────────────────────────────────────┐   │  │
                        │   │   │  FastAPI + Mangum (Container Image)  │   │  │
                        │   │   │  Memory: 1024MB  Timeout: 60s        │   │  │
                        │   │   └──────────────┬───────────────────────┘   │  │
                        │   └──────────────────│───────────────────────────┘  │
                        │                      │                              │
                        │         ┌────────────┴──────────┐                  │
                        │         │                       │                  │
                        │         ▼                       ▼                  │
                        │  ┌─────────────┐    ┌──────────────────┐          │
                        │  │  CloudWatch │    │   ECR Registry   │          │
                        │  │    Logs     │    │  (Docker Images) │          │
                        │  └─────────────┘    └──────────────────┘          │
                        │                                                     │
                        │         ┌──────────────────────┐                   │
                        │         │   SSM Parameter Store│                   │
                        │         │  (GEMINI_API_KEY 🔑) │                   │
                        │         └──────────────────────┘                   │
                        │                                                     │
                        │         ┌──────────────────────┐                   │
                        │         │   IAM Roles          │                   │
                        │         │  (Zero-Trust Policy) │                   │
                        │         └──────────────────────┘                   │
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
- `/api/*` → CloudFront (AllViewerExceptHostHeader policy) → **Lambda Function URL** → **Lambda** (FastAPI + Mangum)
- Lambda outbound → **Gemini API** (via public internet, no VPC/NAT needed)
- Secrets injected at runtime from **SSM Parameter Store**

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (static SPA) |
| Backend | Python / FastAPI + Mangum |
| Containerization | Docker / Amazon ECR |
| Compute | AWS Lambda (Serverless, Container Image) |
| CDN | AWS CloudFront |
| Static Hosting | AWS S3 |
| Secrets Management | AWS SSM Parameter Store |
| Observability | AWS CloudWatch Logs |
| IaC | Terraform |
| LLM | Google Gemini API |

## ☁️ Infrastructure Highlights

All infrastructure is automated and managed via **Terraform**, with a focus on high availability, global low latency (TTFB < 50ms), and cost optimization:

- **Frontend (Global Edge Caching):** Static assets (React build) are hosted on **Amazon S3** and distributed globally via **CloudFront CDN** edge nodes, delivering near-instant page loads worldwide.
- **Backend (Serverless Compute):** Dynamic API requests are routed by CloudFront directly to **AWS Lambda** via a Function URL, using the `AllViewerExceptHostHeader` origin request policy to ensure correct host resolution. The FastAPI app runs as a container image with **Mangum** as the ASGI adapter, requiring zero server management.
- **Security & Cost Optimization:** The entire system follows a **Zero-Trust** architecture. Migrating from ECS + ALB to Lambda eliminated over $20/month in fixed infrastructure costs (ALB hourly fees, cross-AZ data transfer, ECS compute). Lambda's pay-per-invocation model means near-zero cost during low-traffic periods.