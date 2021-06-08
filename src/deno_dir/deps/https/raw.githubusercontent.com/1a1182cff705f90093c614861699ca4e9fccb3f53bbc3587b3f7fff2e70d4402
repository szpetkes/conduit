import { ConsoleLogger } from "../loggers/console_logger.ts";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

interface File {
  filename: string;
  replaceTheRegex: RegExp;
  replaceWith: string;
}

interface ParsedArgs {
  branch?: string; // value of the --version arg
}

interface Versions {
  latest: string; // "v1.2.3"
  versions: string[]; // ["v1.2.3", "v1.2.2", ...[
}

/**
 * Used to update version strings as part of the bumper CI process when new
 * Deno, Deno Std, and Drash Land module version are released.
 */
export class BumperService {
  /**
   * A property to hold Deno.args.
   */
  protected args: string[] = [];

  /**
   * A property to determine whether or not the .bump() method should bump for
   * pre-release.
   */
  protected is_for_pre_release = false;

  /**
   * A list of latest versions. This object should contain (at the very least):
   *     - This module's latest version
   *     - Deno's latest version
   *     - Deno Std's latest version
   */
  protected latest_versions: { [key: string]: string } = {};

  /**
   * The name of the module using this class.
   */
  protected module_name: string;

  /**
   * A property to hold the Deno.args parsed into key-value pairs.
   */
  protected parsed_args: ParsedArgs;

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - CONTRUCTOR //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Construct an object of this class.
   *
   * @param moduleName - The name of the module using this class.
   */
  constructor(moduleName: string, args?: string[]) {
    this.module_name = moduleName;

    // Make a copy of the args in case they're readonly, which means we can't
    // mutate them. We want them mutable just in case.
    if (args && args.length >= 1) {
      this.args = args.slice();
    }

    // Parse the arguments into key-value pairs
    this.parsed_args = this.getParsedArgs();

    // Are we using this class to bump versions for pre-release?
    if (this.parsed_args.branch) {
      this.is_for_pre_release = true;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - PUBLIC ////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Bump all occurances of Deno and Deno Std versions in the filesystem.
   *
   * @example
   * const files = [
   *   {
   *     filename: "./README.md",
   *     replaceTheRegex: /drash@v[0-9.]+[0-9.]+[0-9]/g,
   *     replaceWith: "drash@v{{ latestDrashRelease }}"
   *   }
   * ]
   *
   *   - Replace drash versions; use `replaceWith: "{{ latestDrashVersion }}"`
   *   - Replace std versions; use `...: "{{ latestStdVersion }}"`
   *   - Replace deno versions; use `...: "{{ latestDenoVersion }}"`
   *
   * All versions do not have the `v`, so add them yourself
   *
   * @param files - Files to replace content in and re-write to fs
   * @param write - Should this method write to the filesystem? Defaults to
   * true.
   */
  public async bump(files: File[], write: boolean = true): Promise<string[]> {
    this.latest_versions = await this.getLatestVersions();
    const ret: string[] = [];

    if (this.is_for_pre_release) {
      return this.bumpForPreRelease(files, write);
    }

    files = this.replaceVersionVariables(files);

    files.forEach((file) => {
      ret.push(this.writeFile(file, write));
    });

    return ret;
  }

  /**
   * Bump all occurances of this module's version for pre-release purposes. This
   * method should bump all files that has this module's version. For example,
   * this should bump eggs.json, README.md, etc.
   *
   * @param files - List of files to update with the version strings.
   * @param write - Should this method write to the filesystem? Defaults to
   * true.
   */
  public bumpForPreRelease(files: File[], write: boolean = true): string[] {
    if (!this.parsed_args.branch) {
      throw new Error(
        "Tried bumping for pre-release, but a release branch was not specified.",
      );
    }

    const ret: string[] = [];

    const version = this.parsed_args.branch.substring(
      this.parsed_args.branch.indexOf("v") + 1,
    ); // 1.0.5

    files = this.replaceVersionVariables(files);

    files.forEach((file) => {
      file.replaceWith = file.replaceWith.replace(
        "{{ thisModulesLatestVersion }}",
        version ? version : this.latest_versions[this.module_name],
      );

      ret.push(this.writeFile(file, write));
    });

    return ret;
  }

  /**
   * Is this bumper service being used for pre-release pruposes?
   *
   * @returns True if for pre-release purposes; false if not.
   */
  public isForPreRelease(): boolean {
    return this.is_for_pre_release;
  }

  /**
   * Get the latest versions for this module, deno, and deno std.
   *
   * @returns An object of key-value pairs where the key is the module in
   * question and the value is the module's latest version.
   */
  public async getLatestVersions(): Promise<{ [key: string]: string }> {
    let latestVersions = {
      [this.module_name]: "(Module not found)",
      deno: await this.getModulesLatestVersion("deno"),
      deno_std: await this.getModulesLatestVersion("std"),
      drash: await this.getModulesLatestVersion("drash"),
    };

    try {
      latestVersions[this.module_name] = await this.getModulesLatestVersion(
        this.module_name,
      );
    } catch (error) {
    }

    return latestVersions;
  }

  /**
   * Get the name of the module using this service.
   *
   * @returns The name of the module using this service.
   */
  public getModuleName(): string {
    return this.module_name;
  }

  /**
   * Get the latest version of the module using this class from Deno's CDN.
   * Deno's CDN responses look like the following:
   *
   *     {
   *       "latest":"v1.1.5",
   *       "versions":[
   *          "v1.1.5",
   *          "v1.1.4",
   *          "v1.1.2",
   *          "v1.1.1",
   *          "v1.1.0",
   *          "v1.0.5",
   *          "v1.0.4",
   *          "v1.0.3",
   *          "v1.0.2",
   *          "v1.0.1",
   *          "v1.0.0"
   *       ]
   *     }
   *
   * @param moduleName - The name of the module to get the latest version from.
   */
  public async getModulesLatestVersion(moduleName: string): Promise<string> {
    const res = await fetch(
      `https://cdn.deno.land/${moduleName}/meta/versions.json`,
    );

    const version: Versions = await res.json();

    return version.latest.replace("v", "");
  }

  /**
   * Parse Deno.args into key-value pairs.
   *
   * @returns A key-value pair object where the key is the arg and the value is
   * the arg value. For example, if --version=v1.2.3, then the key would be
   * version and the value would be v1.2.3.
   */
  public getParsedArgs(): ParsedArgs {
    let args: ParsedArgs = {};

    this.args.forEach((arg: string) => {
      if (arg.includes("--version")) {
        args.branch = arg.split("=")[1];
      }
    });

    return args;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - PROTECTED /////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Write the file in question to the filesystem.
   *
   * @param file - The file to write to the filesystem.
   */
  protected writeFile(file: File, write: boolean = true): string {
    try {
      if (write) {
        ConsoleLogger.info(`Writing file: ${file.filename}`);
      }
      let fileContent = decoder.decode(Deno.readFileSync(file.filename));
      fileContent = fileContent.replace(file.replaceTheRegex, file.replaceWith);
      if (write) {
        Deno.writeFileSync(file.filename, encoder.encode(fileContent));
      }
      return fileContent;
    } catch (error) {
      ConsoleLogger.error(error.stack);
    }

    return "";
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - PRIVATE ///////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Replaces template variables with what values they should have
   *
   * @param files - The list of files to replace the `replaceWith` with
   *
   * @example
   * Say `file.replaceWith` is `{{ latestStdVersion }}`, this method will replace that with
   * the latest std version
   */
  private replaceVersionVariables(files: File[]): File[] {
    files.forEach((file) => {
      file.replaceWith = file.replaceWith.replace(
        "{{ latestDenoVersion }}",
        this.latest_versions.deno,
      );

      file.replaceWith = file.replaceWith.replace(
        "{{ latestStdVersion }}",
        this.latest_versions.deno_std,
      );

      file.replaceWith = file.replaceWith.replace(
        "{{ latestDrashVersion }}",
        this.latest_versions.drash,
      );
    });

    return files;
  }
}
