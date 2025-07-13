# 🌿 Vuon La Nho - Foliage Shop Platform
A full-stack e-commerce project for selling foliage plants. The platform is built with modern web technologies (React, Node.js), containerized using Docker, and deployed to production on Google Kubernetes Engine (GKE) with full GitOps CI/CD automation and HTTPS domain.
# 🌍 Visit Production Site 👉[here](https://vuonlanho.store).
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

## 🧪 Local Development
**Frontend**
```
cd frontend
npm install
npm run dev
```
**Backend**
```
cd frontend
npm install
npm run server
```
## 📦 Build and Push Docker Images
```
docker build -t your-dockerhub/frontend:<tag> ./frontend
docker push your-dockerhub/frontend:<tag>
```
```
docker build -t your-dockerhub/admin:<tag> ./admin
docker push your-dockerhub/admin:<tag>
```
```
docker build -t your-dockerhub/backend:<tag> ./backend
docker push your-dockerhub/backend:<tag>
```
## 📦 Deploy with Helm Chart
- Cập nhật tên image:tag khi push lên dockerhub.
```
helm install vuonlanho .
```
- Cập nhật tên image:tag khi push lên dockerhub.
```
helm upgrade vuonlanho . --values values.yaml
```




