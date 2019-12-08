
import { QueryResult } from './db';
import { Actions } from './history';

export interface BeforeHookContext {
	action: Actions.Migrate | Actions.Rollback;
	version: string;
	sql: string;
}

export interface AfterHookContext {
	action: Actions.Migrate | Actions.Rollback;
	version: string;
	sql: string;
	finalSql: string | string[];
	result: QueryResult | QueryResult[];
}

export type BeforeHookResult = void | string | string[] | PromiseLike<void> | PromiseLike<string> | PromiseLike<string[]>;

export interface BeforeHook {
	(context: BeforeHookContext): BeforeHookResult;
}

export type AfterHookResult = void | PromiseLike<void>;

export interface AfterHook {
	(error: any, context: AfterHookContext): AfterHookResult;
}

export interface Hooks {
	before: BeforeHook;
	after: AfterHook;
}
