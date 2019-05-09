
A simple migration management tool for MySQL

### Install

```bash
$ npm install -g @viva-eng/mysql-migrate
```

### Usage

```bash
mysql-migrate [command]

Commands:
  mysql-migrate init [directory]  Create a new migration project
  mysql-migrate bootstrap         Bootstraps a database
  mysql-migrate create [name]     Creates a new migration
  mysql-migrate list              Lists out all existing migrations
  mysql-migrate migrate           Migrates the database up to the given version
  mysql-migrate rollback          Rolls back the database to the given version
  mysql-migrate history           Returns the recent migration history of the database
  mysql-migrate completion        Outputs a bash completion script for mysql-migrate

Options:
  --version      Show version number                                                                           [boolean]
  -v, --verbose  Enables verbose logging                                                      [boolean] [default: false]
  --help         Show help                                                                                     [boolean]
```
