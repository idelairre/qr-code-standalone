# vCardQR Code Generator

A standalone React application for generating QR codes with vCard support, built with Vite, React, and Chakra UI v3.

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## GitHub Pages Deployment

This project includes automated scripts for deploying to GitHub Pages. The deployment process handles SPA routing and ensures your React app works correctly on GitHub Pages.

### Quick Setup

1. **Initial Setup** (run once):

   ```bash
   npm run setup-github-pages
   ```

   This script will automatically configure your `package.json` and `vite.config.js` based on your GitHub repository.

2. **Deploy to GitHub Pages**:

   ```bash
   npm run deploy-full
   ```

   This will build your app and deploy it to the `gh-pages` branch.

3. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings > Pages**
   - Set the source to **gh-pages** branch
   - Wait 5-10 minutes for your site to be available

### Manual Deployment

If you prefer to deploy manually:

```bash
npm run deploy
```

### What the Scripts Do

- **`setup-github-pages.js`**: Automatically configures your project for GitHub Pages deployment
- **`deploy.js`**: Comprehensive deployment script with error checking and helpful output
- **`copy-404.js`**: Copies the 404.html file for SPA routing support

### SPA Routing Support

The deployment includes support for Single Page Application routing:

- Custom 404.html file that redirects to your app
- Script in index.html that handles client-side routing
- Proper base path configuration for GitHub Pages

Your site will be available at: `https://yourusername.github.io/your-repo-name`

## Usage

### vCard QR Codes

1. Select "vCard (Contact Info)" as the QR code type
2. Choose your preferred vCard version:
   - **vCard 2.1**: Maximum compatibility with older devices
   - **vCard 3.0**: Recommended for most use cases
   - **vCard 4.0**: Latest standard (may not work with all scanners)
   - **MECARD**: Compact format with essential fields only
3. Fill in your contact information
4. Customize the QR code appearance (size, color, error correction)
5. Optionally add a logo overlay
6. Download or copy the generated QR code
