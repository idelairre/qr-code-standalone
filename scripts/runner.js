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
    execCommand,
    handleError,
    safeExecute,
    getPackageJson
} from './utils.js';

function runScript(scriptName, description) {
    logProgress(`Running ${description}`);

    try {
        const result = execCommand(`node scripts/${scriptName}`, description);
        if (result) {
            logSuccess(`${description} completed successfully`);
            return true;
        } else {
            logError(`${description} failed`);
            return false;
        }
    } catch (error) {
        logError(`${description} failed: ${error.message}`);
        return false;
    }
}

function runNpmScript(scriptName, description) {
    logProgress(`Running ${description}`);

    try {
        const result = execCommand(`npm run ${scriptName}`, description);
        if (result) {
            logSuccess(`${description} completed successfully`);
            return true;
        } else {
            logError(`${description} failed`);
            return false;
        }
    } catch (error) {
        logError(`${description} failed: ${error.message}`);
        return false;
    }
}

function showAvailableCommands() {
    displayHeader('Available Commands');

    const commands = [
        {
            name: 'setup',
            description: 'Setup GitHub Pages configuration',
            script: 'setup-github-pages'
        },
        {
            name: 'deploy',
            description: 'Deploy to GitHub Pages',
            script: 'deploy-full'
        },
        {
            name: 'build',
            description: 'Build the application',
            script: 'build'
        },
        {
            name: 'dev',
            description: 'Start development server',
            script: 'dev'
        },
        {
            name: 'preview',
            description: 'Preview production build',
            script: 'preview'
        },
        {
            name: 'all',
            description: 'Run setup + deploy (complete deployment)',
            script: 'run-all'
        }
    ];

    log(`${colors.cyan}Available commands:${colors.reset}\n`);

    commands.forEach(cmd => {
        log(`${colors.bright}${colors.green}  ${cmd.name.padEnd(10)}${colors.reset} - ${cmd.description}`);
    });

    log(`\n${colors.cyan}Usage:${colors.reset}`);
    log(`  node scripts/runner.js <command>`);
    log(`  npm run runner <command>\n`);

    log(`${colors.cyan}Examples:${colors.reset}`);
    log(`  node scripts/runner.js setup`);
    log(`  node scripts/runner.js deploy`);
    log(`  node scripts/runner.js all`);
    log(`  npm run runner dev`);
}

function runCommand(command) {
    const packageJson = getPackageJson();

    switch (command) {
        case 'setup':
            return runNpmScript('setup-github-pages', 'GitHub Pages Setup');

        case 'deploy':
            return runNpmScript('deploy-full', 'Full Deployment to GitHub Pages');

        case 'build':
            return runNpmScript('build', 'Building Application');

        case 'dev':
            logInfo('Starting development server...');
            return runNpmScript('dev', 'Development Server');

        case 'preview':
            return runNpmScript('preview', 'Preview Production Build');

        case 'all':
            displayHeader('🚀 Complete Deployment Runner');
            logInfo('Running complete deployment process...\n');

            const setupSuccess = runNpmScript('setup-github-pages', 'GitHub Pages Setup');
            if (!setupSuccess) {
                logError('Setup failed. Stopping execution.');
                return false;
            }

            const deploySuccess = runNpmScript('deploy-full', 'Full Deployment to GitHub Pages');
            if (!deploySuccess) {
                logError('Deployment failed.');
                return false;
            }

            log(`\n${colors.bright}${colors.green}🎉 Complete deployment successful!${colors.reset}`);
            log(`${colors.green}=====================================${colors.reset}`);
            log(`${colors.blue}🌐 Your site should be available at:${colors.reset}`);
            log(`${colors.bright}${colors.cyan}   ${packageJson.homepage}${colors.reset}`);

            log(`\n${colors.yellow}📝 Final step:${colors.reset}`);
            log(`${colors.yellow}   1. Go to your repository on GitHub${colors.reset}`);
            log(`${colors.yellow}   2. Navigate to Settings > Pages${colors.reset}`);
            log(`${colors.yellow}   3. Set source to 'gh-pages' branch${colors.reset}`);
            log(`${colors.yellow}   4. Wait 5-10 minutes for the site to be available${colors.reset}`);

            return true;

        default:
            logError(`Unknown command: ${command}`);
            showAvailableCommands();
            return false;
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showAvailableCommands();
        return;
    }

    const command = args[0];

    if (command === 'list' || command === 'ls') {
        showAvailableCommands();
        return;
    }

    const success = runCommand(command);

    if (!success) {
        process.exit(1);
    }
}

main();
