#!/usr/bin/env node
const commander = require("commander");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const os = require("os");
const spawn = require('cross-spawn');

let projectName;

function init() {
  const program = new commander.Command("create-project-app")
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action((name) => {
      projectName = name;
    })
    // .option("--use-npm")
    // .option("-v")
    .allowUnknownOption()
    .parse(process.argv);

  if (typeof projectName === "undefined") {
    console.error("Please specify the project directory:");
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green("<project-directory>")}`
    );
    console.log();
    console.log("For example:");
    console.log(
      `  ${chalk.cyan(program.name())} ${chalk.green("my-react-app")}`
    );
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  run(projectName);
}

function run(name) {
  const root = path.resolve(name);
  const appName = path.basename(root);

  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
  };

  fs.ensureDirSync(name);
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  install(root);
}

function install(root) {
  const templateName = 'pls-template';
  const child = spawn('yarnpkg', ['add', '--exact', templateName, '--cwd', root], { stdio: 'inherit' });

  child.on('close', code => {
    if (code === 0) {
      const appPackage = require(path.join(root, 'package.json'));
      const templatePath = path.dirname(
        require.resolve(`pls-template/package.json`, { paths: [root] })
      );
      
      const templateJsonPath = path.join(templatePath, 'template.json');
      let templateJson = {};
      if (fs.existsSync(templateJsonPath)) {
        templateJson = require(templateJsonPath);
      }
      const templatePackage = templateJson.package || {};
      const templateDir = path.join(templatePath, 'template');
      appPackage.dependencies = templatePackage.dependencies;
      appPackage.scripts = {
        start: "webpack-dev-server --open --config build/webpack.dev.js",
        build: "webpack --config build/webpack.prod.js",
        lint: "eslint src"
      };
      const command = 'yarnpkg';
      const remove = 'remove';
      let args = ['add', '--exact'];
      const dependenciesToInstall = Object.entries({
        ...templatePackage.dependencies,
        ...templatePackage.devDependencies,
      });
      args = args.concat(
        dependenciesToInstall.map(([dependency, version]) => {
          return `${dependency}@${version}`;
        })
      );

      fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(appPackage, null, 2) + os.EOL
      );
      
      fs.copySync(templateDir, root);
      spawn.sync(command, [...args, '--cwd', root], { stdio: 'inherit' });
      spawn.sync(command, [remove, templateName], {
        stdio: 'inherit',
      });
  
    }
  });
}

init();
