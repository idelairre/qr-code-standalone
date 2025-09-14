#!/usr/bin/env node

import {
    colors,
    log,
    logSuccess,
    logError,
    logWarning,
    logInfo,
    logProgress,
    displayHeader,
    displayGitInfo,
    displayProjectInfo,
    displayNextSteps,
    handleError,
    safeExecute,
    validateGitRepository,
    validatePackageJson,
    getGitRemoteUrl,
    getCurrentBranch,
    hasUncommittedChanges,
    execCommand,
    getPackageJson
} from './utils.js';

function checkPrerequisites() {
    displayHeader('🚀 GitHub Pages Deployment Script');

    safeExecute(() => {
        validateGitRepository();
        const packageJson = validatePackageJson();

        logSuccess('Prerequisites check passed');
        displayProjectInfo(packageJson);
    }, 'Prerequisites validation');
}

function getGitInfo() {
    const remoteUrl = getGitRemoteUrl();
    const currentBranch = getCurrentBranch();
    const hasUncommittedChangesFlag = hasUncommittedChanges();

    return {
        remoteUrl: remoteUrl || 'unknown',
        currentBranch: currentBranch || 'unknown',
        hasUncommittedChanges: hasUncommittedChangesFlag
    };
}

function main() {
    checkPrerequisites();

    const gitInfo = getGitInfo();
    displayGitInfo(gitInfo);

    // Step 1: Build the application
    if (!execCommand('npm run build', 'Building the application')) {
        process.exit(1);
    }

    // Step 2: Deploy to GitHub Pages
    if (!execCommand('npm run deploy', 'Deploying to GitHub Pages')) {
        process.exit(1);
    }

    // Success message
    log(`\n${colors.bright}${colors.green}🎉 Deployment completed successfully!${colors.reset}`);
    log(`${colors.green}=====================================${colors.reset}`);

    const packageJson = getPackageJson();
    displayNextSteps(packageJson.homepage);
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    displayHeader('GitHub Pages Deployment Script');
    log(`${colors.cyan}Usage:${colors.reset}`);
    log(`  node scripts/deploy.js [options]\n`);
    log(`${colors.cyan}Options:${colors.reset}`);
    log(`  --help, -h    Show this help message\n`);
    log(`${colors.cyan}What this script does:${colors.reset}`);
    log(`  1. Checks prerequisites (git repo, package.json config)`);
    log(`  2. Builds the application`);
    log(`  3. Deploys to GitHub Pages using gh-pages`);
    log(`  4. Provides next steps for GitHub Pages setup\n`);
    log(`${colors.cyan}Prerequisites:${colors.reset}`);
    log(`  - Git repository with remote origin`);
    log(`  - package.json with homepage and deploy scripts`);
    log(`  - gh-pages package installed`);
    process.exit(0);
}

main();
