'use strict';

const bootstrap = require('./bootstrap');
const path = require('path');

exports.load = function(modulePaths, resultCallback, options) {

    const args = parseURLQueryArgs();

    /**
	 * // configuration: IWindowConfiguration
	 * @type {{
	 * zoomLevel?: number,
	 * extensionDevelopmentPath?: string | string[],
	 * extensionTestsPath?: string,
	 * userEnv?: { [key: string]: string | undefined },
	 * appRoot?: string,
	 * nodeCachedDataDir?: string
	 * }} */
    const configuration = JSON.parse(args['config'] || '{}') || {};

    // Get the nls configuration into the process.env as early as possible.
	const nlsConfig = bootstrap.setupNLS();

    // Load the loader
    const amdLoader = require(configuration.appRoot + '/jeepney/loader.js');
	const amdRequire = amdLoader.require;
	const amdDefine = amdLoader.require.define;
	const nodeRequire = amdLoader.require.nodeRequire;
    
    window['nodeRequire'] = nodeRequire;
    window['require'] = amdRequire;

    const loaderConfig = {
		baseUrl: bootstrap.uriFromPath(configuration.appRoot),
		'jeepney/nls': nlsConfig,
		nodeModules: [/*BUILD->INSERT_NODE_MODULES*/]
    };
    
	amdRequire.config(loaderConfig);

	// amdDefine('jeepney/workbench/common/xplot/XPlotInterface', null, function (originalFS) { console.log('shite'); console.log(originalFS); })
	amdRequire(['bindings'], function () { console.log('loaded bindings')});

    amdRequire(modulePaths, result => {
        try {
            const callbackResult = resultCallback(result, configuration);
        } catch (error) {
            onUnexpectedError(error, false);
        }
    })

}

/**
 * @returns {{[param: string]: string }}
 */
function parseURLQueryArgs() {
    const search = window.location.search || '';
    
	return search.split(/[?&]/)
		.filter(function (param) { return !!param; })
		.map(function (param) { return param.split('='); })
		.filter(function (param) { return param.length === 2; })
		.reduce(function (r, param) { r[param[0]] = decodeURIComponent(param[1]); return r; }, {});
}

function onUnexpectedError(error, enableDeveloperTools) {

	console.log(error)

	// @ts-ignore
	const ipc = require('electron').ipcRenderer;

	if (enableDeveloperTools) {
		ipc.send('vscode:openDevTools');
	}

	console.error('[uncaught exception]: ' + error);

	if (error.stack) {
		console.error(error.stack);
	}
}