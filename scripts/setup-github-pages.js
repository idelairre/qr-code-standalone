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
    displayNextSteps,
    handleError,
    safeExecute,
    validateGitRepository,
    getGitRemoteUrl,
    extractGitHubInfo,
    setupGitHubPagesConfig
} from './utils.js';

function getGitHubInfo() {
    const remoteUrl = getGitRemoteUrl();
    const { username, repoName } = extractGitHubInfo(remoteUrl);

    return { username, repoName, remoteUrl };
}

function main() {
    displayHeader('🔧 GitHub Pages Setup Script');

    safeExecute(() => {
        validateGitRepository();
    }, 'Git repository validation');

    const gitInfo = getGitHubInfo();

    if (!gitInfo.username || !gitInfo.repoName) {
        logError('Could not determine GitHub username and repository name');
        logWarning('Please ensure your git remote is set to a GitHub repository');
        logInfo('Example: git remote add origin https://github.com/username/repo-name.git');
        process.exit(1);
    }

    log(`${colors.blue}📋 Detected GitHub Information:${colors.reset}`);
    log(`${colors.blue}   Username: ${gitInfo.username}${colors.reset}`);
    log(`${colors.blue}   Repository: ${gitInfo.repoName}${colors.reset}`);
    log(`${colors.blue}   Remote URL: ${gitInfo.remoteUrl}${colors.reset}\n`);

    // Setup GitHub Pages configuration
    logProgress('Setting up GitHub Pages configuration');
    const homepage = setupGitHubPagesConfig(gitInfo.username, gitInfo.repoName);
    logSuccess('Configuration completed');

    // Success message
    log(`\n${colors.bright}${colors.green}🎉 Setup completed successfully!${colors.reset}`);
    log(`${colors.green}=====================================${colors.reset}`);

    displayNextSteps(homepage);
}

main();
