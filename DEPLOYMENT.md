# Deploying BOOKVERSE to AWS (ECR + ECS Fargate + ALB)

One image (Nginx serving the built SPA), default VPC, no backend. Replace REGION, ACCOUNT_ID.

1. **ECR repository**: `aws ecr create-repository --repository-name bookverse --region REGION`
2. **Build**: `docker build --build-arg VITE_DATA_MODE=live --build-arg VITE_GOOGLE_BOOKS_API_KEY=YOUR_RESTRICTED_KEY -t bookverse .`
3. **Tag**: `docker tag bookverse:latest ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/bookverse:latest`
4. **Authenticate**: `aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com`
5. **Push**: `docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/bookverse:latest`
6. **Cluster**: ECS console > Clusters > Create, infrastructure "AWS Fargate", name `bookverse`.
7. **Task definition**: Fargate, Linux/X86_64, 0.25 vCPU / 0.5 GB, execution role `ecsTaskExecutionRole`. Container `bookverse`, image from step 5, port 80 TCP, health command optional (the ALB checks `/health`).
8. **Security groups** (default VPC):
   - `bookverse-alb-sg`: inbound TCP 80 (and 443 if using HTTPS) from 0.0.0.0/0.
   - `bookverse-task-sg`: inbound TCP 80 **only from** `bookverse-alb-sg`.
9. **Target group**: type IP, protocol HTTP, port 80, default VPC, health check path `/health`, success code 200.
10. **Application Load Balancer**: internet-facing, default VPC, at least two public subnets in different AZs, security group `bookverse-alb-sg`, listener HTTP:80 forwarding to the target group. Add an HTTPS listener with an ACM certificate when you have a domain.
11. **ECS service**: cluster `bookverse`, launch type Fargate, task definition from step 7, desired tasks 2, same subnets, security group `bookverse-task-sg`, public IP enabled (needed to pull from ECR without NAT), attach the load balancer and target group from steps 9-10.
12. **Auto scaling**: service > Update > Service auto scaling, min 2, max 6, target tracking on ECS service average CPU at 60%.
13. **Test**: open `http://<ALB-DNS-name>/`, then `/health` (expects `ok`), then reload a nested URL such as `/authors` or `/book/frankenstein` to confirm the SPA fallback.

New release: rebuild, push with the same tag, then ECS service > Update > Force new deployment.
