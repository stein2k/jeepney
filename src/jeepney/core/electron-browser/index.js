'use strict';

const bootstrapWindow = require('../../../bootstrap-window');

// Setup shell environment
process['lazyEnv'] = getLazyEnv();

bootstrapWindow.load([
	'jeepney/workbench/workbench.main'
	], 
    function (workbench, configuration) {
        return process['lazyEnv'].then(function() {
            return require('jeepney/workbench/electron-browser/main').main(configuration); 
        });
	});

/**
 * @returns {Promise<void>}
 */
function getLazyEnv() {
	// @ts-ignore
	const ipc = require('electron').ipcRenderer;

	return new Promise(function (resolve) {
		const handle = setTimeout(function () {
			resolve();
			console.warn('renderer did not receive lazyEnv in time');
		}, 10000);

		ipc.once('vscode:acceptShellEnv', function (event, shellEnv) {
			clearTimeout(handle);
			// bootstrapWindow.assign(process.env, shellEnv);
			// @ts-ignore
			resolve(process.env);
		});

		ipc.send('vscode:fetchShellEnv');
	});
}
