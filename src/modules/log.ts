import chalk from 'chalk';
import util from 'node:util';

class Log {
  public debug(...args: unknown[]): void {
    console.log(
      util.inspect(args, { colors: true, depth: null, showHidden: false })
    );
  }

  public error(...args: unknown[]): void {
    console.log(chalk.red(args));
  }

  public info(...args: unknown[]): void {
    console.log(chalk.blue(args));
  }

  public success(...args: unknown[]): void {
    console.log(chalk.green(args));
  }

  public warning(...args: unknown[]): void {
    console.log(chalk.yellow(args));
  }
}

export default new Log();
