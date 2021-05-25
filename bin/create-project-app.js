#!/usr/bin/env node
const commander = require("commander");
const chalk = require("chalk");
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
}

init();
