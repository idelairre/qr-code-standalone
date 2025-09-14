import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
export const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Project root directory
export const PROJECT_ROOT = join(__dirname, '..');

// Common file paths
export const PATHS = {
    packageJson: join(PROJECT_ROOT, 'package.json'),
    viteConfig: join(PROJECT_ROOT, 'vite.config.js'),
    indexHtml: join(PROJECT_ROOT, 'index.html'),
    public404: join(PROJECT_ROOT, 'public', '404.html'),
    dist404: join(PROJECT_ROOT, 'dist', '404.html'),
    dist: join(PROJECT_ROOT, 'dist'),
    git: join(PROJECT_ROOT, '.git')
};

// Logging functions
export function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

export function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

export function logError(message) {
    log(`❌ ${message}`, 'red');
}

export function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

export function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

export function logProgress(message) {
    log(`🔄 ${message}...`, 'cyan');
}

// File system utilities
export function readJsonFile(filePath) {
    try {
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (error) {
        throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
    }
}

export function writeJsonFile(filePath, data) {
    try {
        writeFileSync(filePath, JSON.stringify(data, null, 4));
    } catch (error) {
        throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
    }
}

export function readTextFile(filePath) {
    try {
        return readFileSync(filePath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read text file ${filePath}: ${error.message}`);
    }
}

export function writeTextFile(filePath, content) {
    try {
        writeFileSync(filePath, content);
    } catch (error) {
        throw new Error(`Failed to write text file ${filePath}: ${error.message}`);
    }
}

export function fileExists(filePath) {
    return existsSync(filePath);
}

// Git utilities
export function getGitRemoteUrl() {
    try {
        return execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    } catch (error) {
        return null;
    }
}

export function getCurrentBranch() {
    try {
        return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch (error) {
        return null;
    }
}

export function hasUncommittedChanges() {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
        return status !== '';
    } catch (error) {
        return false;
    }
}

export function extractGitHubInfo(remoteUrl) {
    if (!remoteUrl || !remoteUrl.includes('github.com')) {
        return { username: null, repoName: null };
    }

    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (match) {
        return {
            username: match[1],
            repoName: match[2].replace('.git', '')
        };
    }

    return { username: null, repoName: null };
}

// Command execution utilities
export function execCommand(command, description, options = {}) {
    const defaultOptions = {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
    };

    const execOptions = { ...defaultOptions, ...options };

    try {
        logProgress(description);
        execSync(command, execOptions);
        logSuccess(`${description} completed`);
        return true;
    } catch (error) {
        logError(`${description} failed: ${error.message}`);
        return false;
    }
}

// Package.json utilities
export function getPackageJson() {
    return readJsonFile(PATHS.packageJson);
}

export function updatePackageJson(updates) {
    const packageJson = getPackageJson();
    const updated = { ...packageJson, ...updates };
    writeJsonFile(PATHS.packageJson, updated);
    return updated;
}

export function addPackageJsonScripts(scripts) {
    const packageJson = getPackageJson();
    if (!packageJson.scripts) {
        packageJson.scripts = {};
    }

    Object.assign(packageJson.scripts, scripts);
    writeJsonFile(PATHS.packageJson, packageJson);
    return packageJson;
}

// Vite config utilities
export function updateViteBasePath(repoName) {
    const viteConfig = readTextFile(PATHS.viteConfig);
    const newBase = `base: '/${repoName}/',`;
    const updated = viteConfig.replace(/base:\s*['"][^'"]*['"]/, newBase);
    writeTextFile(PATHS.viteConfig, updated);
}

// Validation utilities
export function validateGitRepository() {
    if (!fileExists(PATHS.git)) {
        throw new Error('Not in a git repository. Please initialize git first.');
    }
}

export function validatePackageJson() {
    if (!fileExists(PATHS.packageJson)) {
        throw new Error('package.json not found');
    }

    const packageJson = getPackageJson();

    if (!packageJson.homepage) {
        throw new Error('homepage field not found in package.json');
    }

    if (!packageJson.scripts?.deploy) {
        throw new Error('deploy script not found in package.json');
    }

    return packageJson;
}

// GitHub Pages utilities
export function generateHomepageUrl(username, repoName) {
    return `https://${username}.github.io/${repoName}`;
}

export function setupGitHubPagesConfig(username, repoName) {
    const homepage = generateHomepageUrl(username, repoName);

    // Update package.json
    updatePackageJson({ homepage });
    addPackageJsonScripts({
        predeploy: "npm run build && node scripts/copy-404.js",
        deploy: "gh-pages -d dist"
    });

    // Update vite.config.js
    updateViteBasePath(repoName);

    return homepage;
}

// Display utilities
export function displayHeader(title) {
    log(`\n${colors.bright}${colors.blue}${title}${colors.reset}`);
    log(`${colors.blue}${'='.repeat(title.length)}${colors.reset}\n`);
}

export function displayGitInfo(gitInfo) {
    log(`${colors.blue}📋 Git Information:${colors.reset}`);
    log(`${colors.blue}   Remote: ${gitInfo.remoteUrl}${colors.reset}`);
    log(`${colors.blue}   Branch: ${gitInfo.currentBranch}${colors.reset}`);

    if (gitInfo.hasUncommittedChanges) {
        logWarning('You have uncommitted changes. Consider committing them first.');
    }
}

export function displayProjectInfo(packageJson) {
    log(`${colors.blue}📦 Project: ${packageJson.name}${colors.reset}`);
    log(`${colors.blue}🌐 Homepage: ${packageJson.homepage}${colors.reset}\n`);
}

export function displayNextSteps(homepage) {
    log(`\n${colors.yellow}📝 Next steps:${colors.reset}`);
    log(`${colors.yellow}   1. Go to your repository on GitHub${colors.reset}`);
    log(`${colors.yellow}   2. Navigate to Settings > Pages${colors.reset}`);
    log(`${colors.yellow}   3. Set source to 'gh-pages' branch${colors.reset}`);
    log(`${colors.yellow}   4. Wait 5-10 minutes for the site to be available${colors.reset}`);

    log(`\n${colors.blue}💡 To redeploy after changes, run:${colors.reset}`);
    log(`${colors.bright}${colors.cyan}   npm run deploy-full${colors.reset}`);

    if (homepage) {
        log(`\n${colors.blue}🌐 Your site will be available at:${colors.reset}`);
        log(`${colors.bright}${colors.cyan}   ${homepage}${colors.reset}`);
    }
}

// Error handling utilities
export function handleError(error, context = '') {
    const message = context ? `${context}: ${error.message}` : error.message;
    logError(message);
    process.exit(1);
}

export function safeExecute(fn, context = '') {
    try {
        return fn();
    } catch (error) {
        handleError(error, context);
    }
}
