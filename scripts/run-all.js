#!/usr/bin/env node

import {
   colors,
   displayHeader,
   execCommand,
   log,
   logError,
   logInfo,
   logProgress,
   logSuccess,
} from "./utils.js";

function runPackageScript(scriptName, description) {
   logProgress(`Running ${description}`);

   try {
      const result = execCommand(`bun run ${scriptName}`, description);
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

function main() {
   displayHeader("🚀 Complete Deployment Runner");

   logInfo("This script will run all deployment scripts in the correct order.\n");

   const scripts = [
      {
         name: "setup-github-pages",
         description: "GitHub Pages Setup",
      },
      {
         name: "deploy-full",
         description: "Full Deployment to GitHub Pages",
      },
   ];

   let allSuccessful = true;

   for (const script of scripts) {
      log(`\n${colors.blue}${"=".repeat(50)}${colors.reset}`);

      const success = runPackageScript(script.name, script.description);

      if (!success) {
         allSuccessful = false;
         logError(`❌ ${script.description} failed. Stopping execution.`);
         break;
      }

      log(`\n${colors.green}✅ ${script.description} completed successfully!${colors.reset}`);
   }

   log(`\n${colors.blue}${"=".repeat(50)}${colors.reset}`);

   if (allSuccessful) {
      log(`\n${colors.bright}${colors.green}🎉 All scripts completed successfully!${colors.reset}`);
      log(`${colors.green}=====================================${colors.reset}`);
      log(`${colors.blue}🌐 Your site should be available at:${colors.reset}`);
      log(
         `${colors.bright}${colors.cyan}   https://idelairre.github.io/qr-code-standalone${colors.reset}`,
      );

      log(`\n${colors.yellow}📝 Final step:${colors.reset}`);
      log(`${colors.yellow}   1. Go to your repository on GitHub${colors.reset}`);
      log(`${colors.yellow}   2. Navigate to Settings > Pages${colors.reset}`);
      log(`${colors.yellow}   3. Set source to 'gh-pages' branch${colors.reset}`);
      log(`${colors.yellow}   4. Wait 5-10 minutes for the site to be available${colors.reset}`);
   } else {
      log(
         `\n${colors.bright}${colors.red}❌ Some scripts failed. Please check the errors above.${colors.reset}`,
      );
      process.exit(1);
   }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
   displayHeader("Complete Deployment Runner");
   log(`${colors.cyan}Usage:${colors.reset}`);
   log(`  node scripts/run-all.js [options]\n`);
   log(`${colors.cyan}Options:${colors.reset}`);
   log(`  --help, -h    Show this help message\n`);
   log(`${colors.cyan}What this script does:${colors.reset}`);
   log(`  1. Runs GitHub Pages setup script`);
   log(`  2. Runs full deployment script`);
   log(`  3. Provides final instructions\n`);
   log(`${colors.cyan}Prerequisites:${colors.reset}`);
   log(`  - Git repository with remote origin`);
   log(`  - GitHub CLI installed and authenticated`);
   log(`  - Dependencies installed (bun install)`);
   process.exit(0);
}

main();
