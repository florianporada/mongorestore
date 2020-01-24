# ♻️ Mongorestore script

This script restores a complete (unzipped) mongodb db by db (sync).

## Usage

### Basic

```bash
node index.js <path-to-dump>
```

### Advanced

You are also able to define some `env` variables. The following are supported

```env
MONGODB_PASSWORD
MONGODB_USER
MONGODB_HOST
MONGODB_PORT
MONGODB_DRYRUN
```

## Example

```bash
node index.js  /Users/macuser/Desktop/dump
```
