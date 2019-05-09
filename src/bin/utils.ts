
import { History } from '../history';

const actionWidth = 9;
const timestampWidth = 19;

export const formatHistoryRecordList = (history: History[]) : string[] => {
	let maxVersionWidth = 0;

	history.forEach((record) => {
		if (maxVersionWidth < record.version.length) {
			maxVersionWidth = record.version.length;
		}
	});

	return history.map((record) => formatHistoryRecord(record, maxVersionWidth));
};

export const formatHistoryRecord = (history: History, versionWidth: number = 50) : string => {
	const action = history.action.padEnd(actionWidth, ' ');
	const timestamp = history.run_time.padEnd(timestampWidth, ' ');
	const version = history.version.padEnd(versionWidth, ' ');
	const user = history.run_user;

	return `(${timestamp})  ${action}  ${version}      ${user}`;
};
