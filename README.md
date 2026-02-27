# Vuon La Nho - Foliage Plant E-commerce Platform

A full-stack e-commerce platform for selling foliage plants with AI-powered disease detection. Built with modern web technologies, containerized with Docker, and deployed on Google Kubernetes Engine (GKE) with complete GitOps CI/CD automation.

**Live Demo:** [vuonlanho.store](https://vuonlanho.store)  
**Infrastructure Repository:** [vuon_la_nho-config](https://github.com/DuongHung1712/vuon_la_nho-config)

---

## Key Features

### Customer Features

- **Shopping Experience** - Browse products, add to cart, and complete purchases
- **User Authentication** - Secure registration, login, and profile management
- **Payment Integration** - Support for Stripe and Razorpay payment gateways
- **Multi-language Support** - i18n integration for Vietnamese and English
- **AI Disease Detection** - Upload plant leaf images to detect diseases using ML model
- **Order Tracking** - View order history and status updates
- **Product Search & Filters** - Find products easily with advanced filtering

### Admin Features

- **Dashboard** - View sales statistics and order management
- **Product Management** - Add, edit, and delete products with image uploads
- **Order Management** - Process and update order statuses
- **User Management** - View and manage customer accounts

### Technical Features

- **Microservices Architecture** - API Gateway routing requests to backend services
- **Containerized Deployment** - Docker images for all services
- **Kubernetes Orchestration** - Deployed on GKE with Helm charts
- **CI/CD Pipeline** - Automated deployment with GitHub Actions and ArgoCD
- **Monitoring & Observability** - Prometheus and Grafana integration
- **HTTPS & SSL** - Automated certificate management with cert-manager and Let's Encrypt
- **Email Notifications** - Order confirmations and updates via nodemailer

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │    Admin    │     │ API Gateway │
│   (React)   │────▶│   (React)   │────▶│  (Express)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                                         ┌──────▼──────┐
                                         │   Backend   │
                                         │  (Node.js)  │
                                         └──────┬──────┘
                                                │
                    ┌───────────┬───────────────┼───────────┬──────────┐
                    ▼           ▼               ▼           ▼          ▼
              ┌──────────┐ ┌─────────┐   ┌──────────┐ ┌─────────┐ ┌──────┐
              │ MongoDB  │ │Cloudinary│   │  Stripe  │ │Razorpay │ │  ML  │
              │ Database │ │ (Images) │   │   API    │ │   API   │ │Model │
              └──────────┘ └─────────┘   └──────────┘ └─────────┘ └──────┘
```

---

## Tech Stack

### Frontend & Admin

- **Framework:** React 19 with Vite
- **Routing:** React Router DOM v7
- **State Management:** React Context + TanStack Query
- **Styling:** Tailwind CSS + shadcn/ui components
- **Form Handling:** React Hook Form
- **HTTP Client:** Axios
- **Internationalization:** i18next + react-i18next

### Backend

- **Runtime:** Node.js with Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Passport.js (Local & Facebook strategies)
- **File Upload:** Multer + Cloudinary
- **Validation:** Express Validator
- **Email Service:** Nodemailer
- **Payment Gateways:** Stripe, Razorpay
- **Security:** bcrypt for password hashing, cookie-parser

### Machine Learning

- **Framework:** TensorFlow/Keras
- **Model:** Xception-based CNN for plant disease detection
- **Image Processing:** Python with PIL/OpenCV

### DevOps & Infrastructure

- **Containerization:** Docker
- **Orchestration:** Kubernetes (GKE)
- **Package Manager:** Helm
- **CI/CD:** GitHub Actions + ArgoCD
- **Monitoring:** Prometheus + Grafana
- **SSL/TLS:** cert-manager + Let's Encrypt
- **API Gateway:** Express-based reverse proxy

---

## Project Structure

```
vuonlanho/
├── frontend/          # Customer-facing React app
├── admin/             # Admin dashboard React app
├── backend/           # Node.js REST API
│   ├── controllers/   # Request handlers
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Auth & validation
│   ├── ml/            # Disease detection model
│   └── config/        # Database, email, cloudinary config
├── api-gateway/       # API Gateway service
└── helm/              # Kubernetes deployment configs (in separate repo)
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Docker & Docker Compose (for containerized deployment)
- Python 3.8+ (for ML module)

### Local Development

#### 1. Clone the repository

```bash
git clone https://github.com/DuongHung1712/vuon_la_nho.git
cd vuonlanho
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file with the following variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_SECRET_KEY=your_secret_key
# STRIPE_SECRET_KEY=your_stripe_secret
# ADMIN_EMAIL=admin@example.com
# ADMIN_PASSWORD=your_admin_password

npm run server  # Runs on http://localhost:4000
```

#### 3. ML Module Setup (Optional)

```bash
cd backend/ml
pip install -r requirements.txt

# Place your xception_best.keras model file in this directory
# Test the API at http://localhost:4000/api/disease-detection/detect
```

#### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

#### 5. Admin Dashboard Setup

```bash
cd admin
npm install
npm run dev  # Runs on http://localhost:5174
```

#### 6. API Gateway Setup (Optional for local dev)

```bash
cd api-gateway
npm install
npm start  # Runs on configured port
```

---

## Docker Deployment

### Build Docker Images

```bash
# Backend
docker build -t your-dockerhub-username/vuonlanho-backend:v1.0.0 ./backend

# Frontend
docker build -t your-dockerhub-username/vuonlanho-frontend:v1.0.0 ./frontend

# Admin
docker build -t your-dockerhub-username/vuonlanho-admin:v1.0.0 ./admin

# API Gateway
docker build -t your-dockerhub-username/vuonlanho-gateway:v1.0.0 ./api-gateway
```

### Push to Docker Hub

```bash
docker push your-dockerhub-username/vuonlanho-backend:v1.0.0
docker push your-dockerhub-username/vuonlanho-frontend:v1.0.0
docker push your-dockerhub-username/vuonlanho-admin:v1.0.0
docker push your-dockerhub-username/vuonlanho-gateway:v1.0.0
```

---

## Kubernetes Deployment

### Using Helm Charts

1. **Update image tags in values.yaml**

```yaml
backend:
  image:
    repository: your-dockerhub-username/vuonlanho-backend
    tag: v1.0.0
frontend:
  image:
    repository: your-dockerhub-username/vuonlanho-frontend
    tag: v1.0.0
# ... update other services
```

2. **Install the Helm chart**

```bash
helm install vuonlanho ./helm -f values.yaml
```

3. **Upgrade deployment**

```bash
helm upgrade vuonlanho ./helm --values values.yaml
```

4. **Check deployment status**

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

For detailed Kubernetes configuration, see the [infrastructure repository](https://github.com/DuongHung1712/vuon_la_nho-config).

---

## CI/CD Pipeline

The project uses GitHub Actions for CI and ArgoCD for CD:

1. **Push to main branch** triggers GitHub Actions
2. **GitHub Actions** builds Docker images and pushes to Docker Hub
3. **GitHub Actions** updates image tags in the config repository
4. **ArgoCD** detects changes and deploys to GKE automatically

### Environment Variables

Set these secrets in your GitHub repository:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `GKE_PROJECT`
- `GKE_CLUSTER`
- `ARGOCD_TOKEN`

---

## Monitoring

Access monitoring dashboards (configured in your GKE cluster):

- **Prometheus:** Metrics collection and alerting
- **Grafana:** Visualization dashboards for system health and performance

---

## Security Considerations

- JWT tokens for authentication with HTTP-only cookies
- bcrypt password hashing
- MongoDB injection prevention with Mongoose
- CORS configuration for API access control
- HTTPS enforced via Let's Encrypt certificates
- Environment variables for sensitive data
- Input validation with express-validator

---

## API Documentation

### Main Endpoints

**Authentication**

- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login

**Products**

- `GET /api/product/list` - Get all products
- `POST /api/product/add` - Add new product (admin)
- `POST /api/product/remove` - Remove product (admin)

**Cart**

- `POST /api/cart/get` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart item

**Orders**

- `POST /api/order/place` - Place order (COD)
- `POST /api/order/stripe` - Place order with Stripe
- `POST /api/order/razorpay` - Place order with Razorpay
- `POST /api/order/userorders` - Get user orders
- `POST /api/order/list` - Get all orders (admin)

**Disease Detection**

- `POST /api/disease-detection/detect` - Detect plant disease from image

---

## Seed Data

To populate the database with sample plant products:

```bash
cd backend
npm run seed
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is licensed under the ISC License.

---

## Author

**Duong Hung**  
[GitHub Profile](https://github.com/DuongHung1712)

---

## Support

For issues and questions, please open an issue in this repository or visit our [live site](https://vuonlanho.store).
