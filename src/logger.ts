
interface LogFunc {
	(message: any): void;
}

export const enum LogLevel {
	None = 0,
	Error = 1,
	Warn = 2,
	Info = 3,
	Verbose = 4
}

const prefixes = {
	[LogLevel.Error]: 'error',
	[LogLevel.Warn]: 'warn',
	[LogLevel.Info]: 'info',
	[LogLevel.Verbose]: 'verbose'
}

let logLevel = LogLevel.Info;

export const setLogLevel = (newLogLevel: LogLevel) => {
	logLevel = newLogLevel;
};

const createLogger = (level: LogLevel, func: 'error' | 'warn' | 'log') => {
	const prefix = prefixes[level];

	return (message: any) => {
		if (level <= logLevel) {
			console[func](`[mysql-migrate] ${prefix}:`, message);
		}
	};
};

export const logger = {
	error: createLogger(1, 'error'),
	warn: createLogger(2, 'warn'),
	info: createLogger(3, 'log'),
	verbose: createLogger(4, 'log')
};
