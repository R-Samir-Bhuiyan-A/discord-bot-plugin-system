# Deployment Guide

This guide explains how to deploy the Discord Bot Plugin System to production environments. Proper deployment ensures optimal performance, security, and reliability.

## 🎯 Deployment Options

### Self-Hosted Deployment
- **VPS/Dedicated Server**: Most control and customization
- **Home Server**: Cost-effective for personal use
- **Cloud Server**: Scalable and reliable option

### Managed Hosting
- **Platform as a Service (PaaS)**: Heroku, Vercel, etc.
- **Container Services**: Docker Swarm, Kubernetes
- **Cloud Providers**: AWS, Google Cloud, Azure

## 🛠️ Pre-Deployment Checklist

Before deploying to production, ensure you have:

1. **Production Environment Variables**:
   ```env
   NODE_ENV=production
   LOG_LEVEL=INFO
   PORT=80  # or 443 for HTTPS
   ```

2. **Valid Discord Bot Token**
3. **Domain Name** (if using custom domain)
4. **SSL Certificate** (for HTTPS)
5. **Firewall Configuration**
6. **Backup Strategy**
7. **Monitoring Setup**

## 🖥️ Self-Hosted Deployment

### Ubuntu/Debian Server Setup

#### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Node.js
```bash
# Install Node.js 18 (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. Install Git
```bash
sudo apt install git -y
```

#### 4. Create Application User
```bash
sudo useradd --create-home --shell /bin/bash discordbot
sudo usermod -aG sudo discordbot
```

#### 5. Clone Repository
```bash
sudo su - discordbot
git clone https://github.com/your-username/discord-bot-plugin-system.git
cd discord-bot-plugin-system
```

#### 6. Install Dependencies
```bash
npm install --production
```

#### 7. Configure Environment
```bash
cp .env.example .env
# Edit .env with production settings
nano .env
```

Production `.env` example:
```env
DISCORD_TOKEN=your_production_discord_token
PORT=80
NODE_ENV=production
LOG_LEVEL=INFO
REPO_URL=https://your-plugin-repo.com
DATA_DIR=/home/discordbot/data
BACKUP_DIR=/home/discordbot/backups
MAX_LOG_SIZE=50MB
MAX_LOG_FILES=10
```

#### 8. Set File Permissions
```bash
chmod 600 .env
chmod 755 -R .
```

### Process Management with PM2

#### 1. Install PM2
```bash
sudo npm install -g pm2
```

#### 2. Start Application
```bash
pm2 start index.js --name "discord-bot" --log-date-format="YYYY-MM-DD HH:mm:ss"
```

#### 3. Set PM2 to Start on Boot
```bash
pm2 startup
pm2 save
```

#### 4. PM2 Management Commands
```bash
# View application status
pm2 status

# View logs
pm2 logs discord-bot

# Restart application
pm2 restart discord-bot

# Stop application
pm2 stop discord-bot

# Delete application from PM2
pm2 delete discord-bot
```

### Nginx Reverse Proxy Setup

#### 1. Install Nginx
```bash
sudo apt install nginx -y
```

#### 2. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/discord-bot
```

Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }
}
```

#### 3. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/discord-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate with Let's Encrypt

#### 1. Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Obtain Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

#### 3. Auto-renewal
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## ☁️ Cloud Deployment

### Deploying to Heroku

#### 1. Prepare for Heroku
Create a `Procfile`:
```
web: npm start
```

#### 2. Set Environment Variables
```bash
heroku config:set DISCORD_TOKEN=your_token_here
heroku config:set NODE_ENV=production
heroku config:set LOG_LEVEL=INFO
```

#### 3. Deploy
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### Deploying to Docker

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

#### 2. Create .dockerignore
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
.vscode
.idea
```

#### 3. Build and Run
```bash
# Build image
docker build -t discord-bot-plugin-system .

# Run container
docker run -d \
  --name discord-bot \
  -p 3000:3000 \
  -e DISCORD_TOKEN=your_token_here \
  -e NODE_ENV=production \
  discord-bot-plugin-system
```

### Deploying to Kubernetes

#### 1. Create Deployment YAML
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: discord-bot
spec:
  replicas: 1
  selector:
    matchLabels:
      app: discord-bot
  template:
    metadata:
      labels:
        app: discord-bot
    spec:
      containers:
      - name: discord-bot
        image: your-registry/discord-bot-plugin-system:latest
        ports:
        - containerPort: 3000
        env:
        - name: DISCORD_TOKEN
          valueFrom:
            secretKeyRef:
              name: discord-bot-secrets
              key: token
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

#### 2. Create Service YAML
```yaml
apiVersion: v1
kind: Service
metadata:
  name: discord-bot-service
spec:
  selector:
    app: discord-bot
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 🔧 Production Configuration

### Environment Variables for Production
```env
# Essential
DISCORD_TOKEN=your_production_token
NODE_ENV=production
PORT=80

# Security
LOG_LEVEL=INFO
REPO_URL=https://your-secure-repo.com

# Performance
MAX_LOG_SIZE=50MB
MAX_LOG_FILES=10

# Data Management
DATA_DIR=/var/lib/discord-bot/data
BACKUP_DIR=/var/backups/discord-bot
```

### Security Hardening

#### 1. Firewall Configuration (UFW)
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

#### 2. Fail2Ban Setup
```bash
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
# Configure jails as needed
sudo systemctl restart fail2ban
```

#### 3. Secure File Permissions
```bash
# Set ownership
sudo chown -R discordbot:discordbot /home/discordbot/discord-bot-plugin-system

# Secure sensitive files
sudo chmod 600 /home/discordbot/discord-bot-plugin-system/.env
sudo chmod 750 /home/discordbot/discord-bot-plugin-system

# Restrict access to data directories
sudo chmod 700 /home/discordbot/data
sudo chmod 700 /home/discordbot/backups
```

## 📊 Monitoring and Logging

### Log Management

#### 1. Log Rotation
Create `/etc/logrotate.d/discord-bot`:
```
/home/discordbot/discord-bot-plugin-system/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 discordbot discordbot
    postrotate
        pm2 reload discord-bot > /dev/null 2>&1 || true
    endscript
}
```

#### 2. Centralized Logging
For larger deployments, consider:
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Fluentd**: Log aggregation
- **Papertrail**: Hosted log management
- **Datadog**: Monitoring and log management

### Performance Monitoring

#### 1. System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop iftop -y

# Monitor with PM2
pm2 monit
```

#### 2. Application Performance
- Monitor response times
- Track memory usage
- Watch for errors
- Set up alerts for anomalies

### Health Checks

#### 1. Basic Health Check Endpoint
Add to your application:
```javascript
// Add to core/web/index.js
this.app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

#### 2. External Monitoring
Services like:
- **UptimeRobot**: Website monitoring
- **Pingdom**: Performance monitoring
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure and application monitoring

## 🔄 Backup and Recovery

### Automated Backups

#### 1. Backup Script
Create `/home/discordbot/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/discordbot/backups"
APP_DIR="/home/discordbot/discord-bot-plugin-system"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup plugin configurations
tar -czf $BACKUP_DIR/plugins_$DATE.tar.gz -C $APP_DIR plugins

# Backup data directory
tar -czf $BACKUP_DIR/data_$DATE.tar.gz -C $APP_DIR data

# Backup logs (optional)
tar -czf $BACKUP_DIR/logs_$DATE.tar.gz -C $APP_DIR logs

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

#### 2. Schedule Backups
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/discordbot/backup.sh
```

### Disaster Recovery Plan

#### 1. Recovery Steps
1. Restore from latest backup
2. Reconfigure environment variables
3. Reinstall dependencies
4. Restart services
5. Verify functionality

#### 2. Recovery Testing
- Test backup restoration monthly
- Document recovery procedures
- Train team members on recovery
- Update procedures as needed

## 🚀 Scaling and High Availability

### Horizontal Scaling
For high-traffic bots:
- **Multiple Instances**: Run multiple bot instances
- **Load Balancing**: Distribute web interface load
- **Database Clustering**: For plugins requiring databases
- **CDN**: For static assets

### Vertical Scaling
- **More RAM**: For larger plugin collections
- **Faster CPU**: For intensive operations
- **SSD Storage**: For better I/O performance
- **More Bandwidth**: For high-traffic scenarios

### High Availability Setup
- **Multiple Servers**: Primary and backup servers
- **Automatic Failover**: Using tools like Keepalived
- **Shared Storage**: For plugin data consistency
- **Health Checks**: Monitor and switch automatically

## 🛡️ Security Best Practices

### Application Security
- **Keep Dependencies Updated**: Regular security updates
- **Input Validation**: Validate all user inputs
- **Secure Headers**: Implement security headers
- **Rate Limiting**: Prevent abuse
- **Authentication**: Secure admin interfaces

### Network Security
- **Firewall Rules**: Restrict unnecessary access
- **SSH Security**: Key-based authentication, fail2ban
- **HTTPS Only**: Redirect HTTP to HTTPS
- **Security Headers**: Implement HSTS, CSP, etc.

### Data Security
- **Encryption**: Encrypt sensitive data at rest
- **Backups**: Secure backup storage
- **Access Controls**: Restrict data access
- **Audit Logs**: Track data access

## 📈 Performance Optimization

### Application Optimization
- **Caching**: Implement appropriate caching strategies
- **Database Optimization**: Indexes, query optimization
- **Async Operations**: Non-blocking operations
- **Memory Management**: Avoid memory leaks

### Infrastructure Optimization
- **CDN**: For static assets
- **Compression**: Gzip compression
- **Caching Headers**: Browser caching
- **Connection Pooling**: Database connections

## 🆘 Troubleshooting Production Issues

### Common Production Issues

#### 1. Application Crashes
```bash
# Check PM2 logs
pm2 logs discord-bot

# Check system logs
sudo journalctl -u discord-bot

# Restart application
pm2 restart discord-bot
```

#### 2. High Resource Usage
```bash
# Check system resources
htop
iotop

# Check application memory usage
pm2 monit
```

#### 3. Network Issues
```bash
# Check network connectivity
ping discord.com
curl -v https://discord.com/api/v10

# Check firewall
sudo ufw status
```

### Emergency Procedures

#### 1. Application Down
1. Check if process is running
2. Check logs for errors
3. Restart application
4. Verify functionality
5. Alert stakeholders

#### 2. Security Incident
1. Isolate affected systems
2. Change compromised credentials
3. Review logs for unauthorized access
4. Apply security patches
5. Document incident

## 📋 Post-Deployment Tasks

### 1. Verification Checklist
- [ ] Application is running
- [ ] Web interface is accessible
- [ ] Bot is online in Discord
- [ ] Plugins are loading correctly
- [ ] SSL certificate is valid
- [ ] Firewall is configured
- [ ] Backups are working
- [ ] Monitoring is active

### 2. Documentation Updates
- [ ] Update deployment documentation
- [ ] Record environment-specific settings
- [ ] Document custom configurations
- [ ] Note any deviations from standard procedure

### 3. Team Training
- [ ] Train team on monitoring procedures
- [ ] Document incident response procedures
- [ ] Provide access to monitoring tools
- [ ] Schedule regular maintenance windows

This deployment guide should help you successfully deploy the Discord Bot Plugin System to production. Remember to test thoroughly in a staging environment before deploying to production, and maintain regular backups and monitoring for ongoing reliability.