import { colors } from "../deps.ts";

export class ConsoleLogger {
  /**
   * Log a debug message.
   *
   * @param message The message to log.
   */
  public static debug(message: string): void {
    console.log(colors.green("DEBUG") + " " + message);
  }

  /**
   * Log an error message.
   *
   * @param message The message to log.
   */
  public static error(message: string): void {
    console.log(colors.red("ERROR") + " " + message);
  }

  /**
   * Log an info message.
   *
   * @param message The message to log.
   */
  public static info(message: string): void {
    console.log(colors.blue("INFO") + " " + message);
  }

  /**
   * Log an warning message.
   *
   * @param message The message to log.
   */
  public static warn(message: string): void {
    console.log(colors.yellow("WARN") + " " + message);
  }
}
