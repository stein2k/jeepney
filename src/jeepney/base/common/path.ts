const CHAR_UPPERCASE_A = 65;/* A */
const CHAR_LOWERCASE_A = 97; /* a */
const CHAR_UPPERCASE_Z = 90; /* Z */
const CHAR_LOWERCASE_Z = 122; /* z */
const CHAR_DOT = 46; /* . */
const CHAR_FORWARD_SLASH = 47; /* / */
const CHAR_BACKWARD_SLASH = 92; /* \ */
const CHAR_COLON = 58; /* : */
const CHAR_QUESTION_MARK = 63; /* ? */

class ErrorInvalidArgType extends Error {
	code: 'ERR_INVALID_ARG_TYPE';
	constructor(name: string, expected: string, actual: any) {
		// determiner: 'must be' or 'must not be'
		let determiner;
		if (typeof expected === 'string' && expected.indexOf('not ') === 0) {
			determiner = 'must not be';
			expected = expected.replace(/^not /, '');
		} else {
			determiner = 'must be';
		}

		const type = name.indexOf('.') !== -1 ? 'property' : 'argument';
		let msg = `The "${name}" ${type} ${determiner} of type ${expected}`;

		msg += `. Received type ${typeof actual}`;
		super(msg);
	}
}

function validateString(value: string, name: string) {
	if (typeof value !== 'string') {
		throw new ErrorInvalidArgType(name, 'string', value);
	}
}

function isPathSeparator(code: number) {
	return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}

function isWindowsDeviceRoot(code: number) {
	return code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z ||
		code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z;
}

interface IPath {
    basename(path: string, ext?: string): string;
}

export const win32: IPath  = {

    basename(path: string, ext?: string): string {
		if (ext !== undefined) {
			validateString(ext, 'ext');
		}
		validateString(path, 'path');
		let start = 0;
		let end = -1;
		let matchedSlash = true;
		let i;

		// Check for a drive letter prefix so as not to mistake the following
		// path separator as an extra separator at the end of the path that can be
		// disregarded
		if (path.length >= 2) {
			const drive = path.charCodeAt(0);
			if (isWindowsDeviceRoot(drive)) {
				if (path.charCodeAt(1) === CHAR_COLON) {
					start = 2;
				}
			}
		}

		if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
			if (ext.length === path.length && ext === path) {
				return '';
			}
			let extIdx = ext.length - 1;
			let firstNonSlashEnd = -1;
			for (i = path.length - 1; i >= start; --i) {
				const code = path.charCodeAt(i);
				if (isPathSeparator(code)) {
					// If we reached a path separator that was not part of a set of path
					// separators at the end of the string, stop now
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else {
					if (firstNonSlashEnd === -1) {
						// We saw the first non-path separator, remember this index in case
						// we need it if the extension ends up not matching
						matchedSlash = false;
						firstNonSlashEnd = i + 1;
					}
					if (extIdx >= 0) {
						// Try to match the explicit extension
						if (code === ext.charCodeAt(extIdx)) {
							if (--extIdx === -1) {
								// We matched the extension, so mark this as the end of our path
								// component
								end = i;
							}
						} else {
							// Extension does not match, so our result is the entire path
							// component
							extIdx = -1;
							end = firstNonSlashEnd;
						}
					}
				}
			}

			if (start === end) {
				end = firstNonSlashEnd;
			}
			else if (end === -1) {
				end = path.length;
			}
			return path.slice(start, end);
		} else {
			for (i = path.length - 1; i >= start; --i) {
				if (isPathSeparator(path.charCodeAt(i))) {
					// If we reached a path separator that was not part of a set of path
					// separators at the end of the string, stop now
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else if (end === -1) {
					// We saw the first non-path separator, mark this as the end of our
					// path component
					matchedSlash = false;
					end = i + 1;
				}
			}

			if (end === -1) {
				return '';
			}
			return path.slice(start, end);
		}
	}

}

export const posix: IPath = {

    basename(path: string, ext?: string): string {
		if (ext !== undefined) {
			validateString(ext, 'ext');
		}
		validateString(path, 'path');

		let start = 0;
		let end = -1;
		let matchedSlash = true;
		let i;

		if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
			if (ext.length === path.length && ext === path) {
				return '';
			}
			let extIdx = ext.length - 1;
			let firstNonSlashEnd = -1;
			for (i = path.length - 1; i >= 0; --i) {
				const code = path.charCodeAt(i);
				if (code === CHAR_FORWARD_SLASH) {
					// If we reached a path separator that was not part of a set of path
					// separators at the end of the string, stop now
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else {
					if (firstNonSlashEnd === -1) {
						// We saw the first non-path separator, remember this index in case
						// we need it if the extension ends up not matching
						matchedSlash = false;
						firstNonSlashEnd = i + 1;
					}
					if (extIdx >= 0) {
						// Try to match the explicit extension
						if (code === ext.charCodeAt(extIdx)) {
							if (--extIdx === -1) {
								// We matched the extension, so mark this as the end of our path
								// component
								end = i;
							}
						} else {
							// Extension does not match, so our result is the entire path
							// component
							extIdx = -1;
							end = firstNonSlashEnd;
						}
					}
				}
			}

			if (start === end) {
				end = firstNonSlashEnd;
			}
			else if (end === -1) {
				end = path.length;
			}
			return path.slice(start, end);
		} else {
			for (i = path.length - 1; i >= 0; --i) {
				if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
					// If we reached a path separator that was not part of a set of path
					// separators at the end of the string, stop now
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else if (end === -1) {
					// We saw the first non-path separator, mark this as the end of our
					// path component
					matchedSlash = false;
					end = i + 1;
				}
			}

			if (end === -1) {
				return '';
			}
			return path.slice(start, end);
		}
	}

}

export const basename = (process.platform === 'win32' ? win32.basename : posix.basename);