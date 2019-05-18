
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
