# Deployment Guide - SwasthiQ Pharmacy

## Frontend Deployment (Vercel)

### Prerequisites
1. GitHub account
2. Vercel account (sign up at vercel.com)
3. Git installed

### Steps to Deploy Frontend

1. **Initialize Git Repository** (if not already done)
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
```

2. **Push to GitHub**
```bash
# Create a new repository on GitHub first
git remote add origin https://github.com/YOUR_USERNAME/swasthiq-pharmacy-frontend.git
git branch -M main
git push -u origin main
```

3. **Deploy to Vercel**

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? swasthiq-pharmacy
# - Directory? ./
# - Override settings? No
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: Your backend API URL (update after backend deployment)
5. Click "Deploy"

4. **Update API URL**
After deployment, update the environment variable:
- Go to Vercel Dashboard > Your Project > Settings > Environment Variables
- Update `VITE_API_URL` with your backend URL
- Redeploy

---

## Backend Deployment (Render/Railway/Heroku)

### Option 1: Deploy to Render

1. **Create `render.yaml`** (already created in backend folder)

2. **Push to GitHub**
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/swasthiq-pharmacy-backend.git
git push -u origin main
```

3. **Deploy on Render**
- Go to https://render.com
- Click "New +" > "Web Service"
- Connect your GitHub repository
- Configure:
  - Name: swasthiq-pharmacy-api
  - Environment: Python 3
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add Environment Variable:
  - `DATABASE_URL`: Your Supabase PostgreSQL URL
- Click "Create Web Service"

### Option 2: Deploy to Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Deploy**
```bash
cd backend
railway login
railway init
railway up
```

3. **Add Environment Variables**
```bash
railway variables set DATABASE_URL="your-supabase-url"
```

### Option 3: Deploy to Heroku

1. **Create `Procfile`**
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. **Deploy**
```bash
cd backend
heroku login
heroku create swasthiq-pharmacy-api
heroku config:set DATABASE_URL="your-supabase-url"
git push heroku main
```

---

## Post-Deployment Steps

1. **Update Frontend API URL**
   - Update `VITE_API_URL` in Vercel environment variables
   - Point to your deployed backend URL
   - Redeploy frontend

2. **Update CORS in Backend**
   - Update `main.py` CORS origins
   - Add your Vercel frontend URL
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://your-frontend.vercel.app",
           "http://localhost:3000"
       ],
       ...
   )
   ```

3. **Test the Deployment**
   - Visit your Vercel URL
   - Check if API calls work
   - Test all features

---

## Environment Variables Summary

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## Troubleshooting

### Frontend Issues
- **404 on refresh**: Check vercel.json rewrites configuration
- **API not connecting**: Verify VITE_API_URL is correct
- **Build fails**: Check Node version (use Node 18+)

### Backend Issues
- **Database connection fails**: Verify DATABASE_URL format
- **CORS errors**: Add frontend URL to CORS origins
- **Port issues**: Ensure using `$PORT` environment variable

---

## Monitoring

### Vercel
- View logs: Vercel Dashboard > Deployments > View Function Logs
- Analytics: Vercel Dashboard > Analytics

### Backend
- Render: Dashboard > Logs
- Railway: Dashboard > Deployments > Logs
- Heroku: `heroku logs --tail`

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Backend
1. Add custom domain in hosting platform
2. Update SSL certificate
3. Update frontend VITE_API_URL

---

## Continuous Deployment

Both Vercel and backend platforms support automatic deployments:
- Push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Rollback to previous deployments if needed

---

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Database credentials are secure
- [ ] CORS is configured properly
- [ ] API rate limiting is enabled (optional)
- [ ] HTTPS is enabled
- [ ] Sensitive data is not in git history

---

## Support

For issues:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors
