const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

if (process.argv.length <= 2) {
  console.log(`Usage: ${__filename} path/to/directory`);
  process.exit(-1);
}

const dirPathInput = process.argv[2];

function readDir(dirPath, cb) {
  const dirs = [];
  fs.readdirSync(dirPath).forEach(file => {
    console.log(`🔎 Found: ${file}`);
    if (fs.lstatSync(path.join(dirPath, file)).isDirectory()) {
      // custom condition
      if (!file.includes('2')) {
        console.log(`📂 Adding ${file} to directory list`);
        dirs.push(file);
      } else {
        console.warn(`⚠️ Custom condition triggered - skipping`);
      }
    } else {
      console.warn(`🚫 Not a directory - skipping`);
    }
  });

  console.log(`🗂 Databases to restore ${dirs.toString()}`);
  console.log('⏱ Starting in 10 seconds');

  setTimeout(() => {
    cb(dirs);
  }, 10000);
}

function runMongoRestore(params) {
  const command = `mongorestore --username=${params.user} --password='${params.password}' --host='${
    params.host
  }' --port=${params.port} --numInsertionWorkersPerCollection=4 --db=${
    params.dbname
  } -vvvvv ${path.join(dirPathInput, params.dbname)}`;

  console.log(`♻️ Restoring ${params.dbname} to ${params.host}`);
  console.log(`ℹ️ Command used: ${command}`);

  if (!params.dryRun) {
    execSync(command, {
      stdio: 'inherit'
    });
  } else {
    console.log('🤷‍♂️ Just a dry run');
  }
}

function start() {
  console.log(`🦀 Gonna restore some stuff from ${dirPathInput} now! \n\n`);

  setTimeout(() => {
    readDir(dirPathInput, backupDirs => {
      backupDirs.forEach(item => {
        runMongoRestore({
          user: process.env.MONGODB_USER || '',
          password: process.env.MONGODB_PASSWORD || '',
          host: process.env.MONGODB_HOST || 'localhost',
          port: process.env.MONGODB_PORT || 27017,
          dbname: item,
          dryRun: process.env.MONGODB_DRYRUN || false
        });
      });
    });
  }, 5000);
}

start();
