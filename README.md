# 🌿 Vuon La Nho - Foliage Shop Platform
A full-stack e-commerce project for selling foliage plants. The platform is built with modern web technologies (React, Node.js), containerized using Docker, and deployed to production on Google Kubernetes Engine (GKE) with full GitOps CI/CD automation and HTTPS domain.

# Vườn Lá Nhỏ Repository Config [here](https://github.com/DuongHung1712/vuon_la_nho-config)


## 📦 Tech Stack

- **Frontend**: React (SPA)
- **Backend**: Node.js (REST API)
- **Containerization**: Docker
- **Orchestration**: Kubernetes (GKE)
- **Deployment**: Helm charts (Deployment, Service, Ingress)
- **CI/CD**: GitHub Actions + ArgoCD
- **Monitoring**: Prometheus, Grafana
- **SSL/TLS**: cert-manager + Let's Encrypt
- **Domain**: `https://vuonlanho.store`

---

## 🚀 Features

- 🔐 User Authentication: Login / Register
- 🛒 Shopping Cart
- 📁 Collections (Product listing)
- 💳 Checkout Process (dummy/payment integration)
- 🌐 Deployed on Kubernetes with HTTPS
- 🔄 CI/CD with GitOps

---

## 🧩 Project Structure

```bash
/
├── .github/workflows/     # GitHub Actions for CI/CD
├── frontend/              # React app
  ├── VERSION                # Docker image version tracking
├── admin/              # React app
  ├── VERSION                # Docker image version tracking
├── backend/               # Node.js API
  ├── VERSION                # Docker image version tracking



├── charts/                # Helm charts (Deployment, Service, Ingress)
  ├── values.yaml                
  ├── templates.yaml                
  ├── Chart.yaml
