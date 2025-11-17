```markdown
# 4E Store - GitHub Pages Setup Guide

## 🚀 Deployment Instructions

### Step 1: Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it: `yourusername.github.io` or any name you want
3. Make it public

### Step 2: Upload Files
1. Upload all files maintaining the folder structure:
   ```
   ├── index.html
   ├── products.html
   ├── about.html
   ├── reviews.html
   ├── admin.html
   ├── css/theme.css
   ├── js/cart.js
   ├── js/products.js
   ├── js/api.js
   ├── js/admin.js
   └── data/products.json
   ```

### Step 3: Configure GitHub Pages
1. Go to repository Settings
2. Navigate to "Pages" section
3. Under "Source", select "main" branch
4. Click Save
5. Your site will be live at: `https://yourusername.github.io/repo-name/`

### Step 4: Configure API Connection
1. Open `js/api.js`
2. Replace `YOUR-REPLIT-URL` with your actual Replit URL
3. Replace `YOUR_SECRET_TOKEN_HERE` with your shared secret token

### Step 5: Configure Admin Panel
1. Open `js/admin.js`
2. Change `ADMIN_PASSWORD` to a secure password
3. Add your GitHub Personal Access Token
4. Update `GITHUB_REPO` with your repo name (format: `username/repo-name`)

### Step 6: Create GitHub Personal Access Token (for Admin)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Give it `repo` permissions
4. Copy the token and paste in `js/admin.js`

## 🔧 Configuration

### API Endpoint (Replit)
Create these endpoints on your Replit bot:

```javascript
// POST /api/createOrder
{
  username: "discord#1234",
  cart: [{id, name, price, quantity, type}],
  price: 99.99,
  secret: "YOUR_SECRET_TOKEN"
}
```

### Security
- Keep your GitHub token private
- Use environment variables on Replit
- Change default admin password immediately
- Use HTTPS only

## 📝 Customization

### Update Products
1. Go to `/admin.html`
2. Login with your password
3. Add/Edit/Delete products
4. Changes save automatically to GitHub

### Change Theme Colors
Edit `css/theme.css`:
- Primary: `#8B5CF6` (purple)
- Secondary: `#C084FC` (light purple)
- Accent: `#A855F7` (medium purple)

### Update Discord Link
Edit `about.html` and replace the Discord invite URL

## 🐛 Troubleshooting

### Products not loading
- Check `data/products.json` exists
- Verify JSON format is valid
- Check browser console for errors

### Cart not working
- Clear browser localStorage
- Check if JavaScript files are loaded
- Verify cart.js is included

### Admin can't save
- Verify GitHub token has correct permissions
- Check repository name format
- Ensure token isn't expired

## 📱 Mobile Responsive
The site is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🔒 Security Notes
- Admin password is client-side only (basic protection)
- For production, implement proper authentication
- Never commit GitHub tokens to repository
- Use environment variables for sensitive data

## 📞 Support
For issues, contact support on Discord server.
```

---

## 🎯 Quick Start Checklist

✅ **Before Deployment:**
1. Create GitHub repository
2. Set up Replit bot with API endpoint
3. Generate GitHub Personal Access Token
4. Choose secure admin password
5. Create shared secret token

✅ **After Deployment:**
1. Test product loading
2. Test cart functionality
3. Test checkout process
4. Test admin panel
5. Verify mobile responsiveness

✅ **API Requirements (Replit Bot):**
```javascript
app.post('/api/createOrder', async (req, res) => {
  const { username, cart, price, secret } = req.body;
  
  // Verify secret token
  if (secret !== process.env.SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Process order
  // Send Discord DM to user
  // Store order in database
  
  res.json({ success: true, orderId: 'xxx' });
});
```

---

## 🎨 Theme Preview
- **Purple Neon Glow** aesthetic
- **Animated** text effects
- **Glassmorphism** design elements
- **Responsive** mobile-first layout
- **Smooth** transitions and hover effects
```
