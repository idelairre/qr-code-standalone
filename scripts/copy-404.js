import { copyFileSync } from 'fs';
import {
    logSuccess,
    logError,
    handleError,
    safeExecute,
    fileExists,
    PATHS
} from './utils.js';

function copy404File() {
    safeExecute(() => {
        if (!fileExists(PATHS.public404)) {
            throw new Error('404.html not found in public folder');
        }

        copyFileSync(PATHS.public404, PATHS.dist404);
        logSuccess('404.html copied to dist folder');
    }, 'Copying 404.html file');
}

copy404File();
