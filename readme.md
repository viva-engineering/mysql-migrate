
A simple migration management tool for MySQL

### Install

```bash
$ npm install -g @viva-eng/mysql-migrate
```

### Usage

```bash
mym <command>

Commands:
  mym init [directory]  Create a new migration project
  mym bootstrap         Bootstraps a database
  mym create <name>     Creates a new migration
  mym list              Lists out all existing migrations
  mym migrate           Migrates the database up to the given version
  mym rollback          Rolls back the database to the given version
  mym history           Returns the recent migration history of the database
  mym completion        Outputs a bash completion script for mym

Options:
  --version      Show version number                                                                           [boolean]
  -v, --verbose  Enables verbose logging                                                      [boolean] [default: false]
  --help         Show help                                                                                     [boolean]
```

### Starting a new Project

When starting up a new database project, you'll first need to get your database configuration all set up.

```bash
$ mym init ./my-new-project
```

This will create a new directory for you called `my-new-project`, and create your `.mym.json` file with the basic starting structure for your configuration.

```json
{
  "environments": {
    "default": {
      "host": "localhost",
      "port": 3306,
      "user": "",
      "password": "",
      "database": ""
    }
  }
}
```

After you fill in all the fields with your database configuration, you'll need to bootstrap the project. This will create the history table in your database where we keep track of the current status of the database. In your project directory:

```bash
$ mym bootstrap
```

### Creating new database migrations

Creating a new migration is as simple as calling `mym create`

```bash
$ mym create my-new-migration
```

This will create a new directory inside your project like `0000-my-new-migration` which will contain a number of files.

_Note: The name of the directory is important, as the migrations must be stored in sorted order, and so are prefixed with a timestamp. Renaming the directory can lead to unintended side-effects._

```
migrate.sql
migrate-hooks.js
rollback.sql
rollback-hooks.js
```

The `migrate.sql` file contains the query (or queries) that will run when the migration is executed; Likewise, the `rollback.sql` file contains any queries to run when rolling back the migration. The `migrate-hooks.js` and `rollback-hooks.js` files allow you to write JavaScript functions that will be run before and/or after then migration and rollback are run.






### Hooks

The hooks files alongside your migration and rollback scripts allow you define functions to execute before and after the scripts execute. However, they also have one other function. The before hooks also enable to make modifications to the queries before they are run, such as populating variables, or even replacing the query completely. If your before hook returns a string (or returns a promise that resolves to a string), the string will be treated as a query to be exectued in place of the script contents.

###### migrate-hooks.js

```javascript
exports.before = async (params) => {
  // This tells you what type of action is being performed
  // ("migrate" or "rollback")
  console.log(params.action);

  // This tells you migration version of the script
  // being run (the name of the directory the script is in)
  console.log(params.version);

  // This is the SQL from the script file
  console.log(params.sql);
};

exports.after = async (error, params) => {
  // If an error occured, it will be passed in here
  if (error) {
    console.log(error);
    return;
  }

  // This tells you what type of action is being performed
  // ("migrate" or "rollback")
  console.log(params.action);

  // This tells you migration version of the script
  // being run (the name of the directory the script is in)
  console.log(params.version);

  // This is the SQL from the script file
  console.log(params.sql);

  // This is the SQL that was actually executed (different
  // from the file contents if it was modified by your
  // before hook)
  console.log(params.finalSql);

  // This is the result from the MySQL query call
  console.log(params.result);
};
```
