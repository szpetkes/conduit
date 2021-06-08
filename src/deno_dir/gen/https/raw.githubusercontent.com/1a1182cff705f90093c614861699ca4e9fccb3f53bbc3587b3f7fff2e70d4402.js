import { ConsoleLogger } from "../loggers/console_logger.ts";
const decoder = new TextDecoder();
const encoder = new TextEncoder();
export class BumperService {
    args = [];
    is_for_pre_release = false;
    latest_versions = {};
    module_name;
    parsed_args;
    constructor(moduleName, args) {
        this.module_name = moduleName;
        if (args && args.length >= 1) {
            this.args = args.slice();
        }
        this.parsed_args = this.getParsedArgs();
        if (this.parsed_args.branch) {
            this.is_for_pre_release = true;
        }
    }
    async bump(files, write = true) {
        this.latest_versions = await this.getLatestVersions();
        const ret = [];
        if (this.is_for_pre_release) {
            return this.bumpForPreRelease(files, write);
        }
        files = this.replaceVersionVariables(files);
        files.forEach((file) => {
            ret.push(this.writeFile(file, write));
        });
        return ret;
    }
    bumpForPreRelease(files, write = true) {
        if (!this.parsed_args.branch) {
            throw new Error("Tried bumping for pre-release, but a release branch was not specified.");
        }
        const ret = [];
        const version = this.parsed_args.branch.substring(this.parsed_args.branch.indexOf("v") + 1);
        files = this.replaceVersionVariables(files);
        files.forEach((file) => {
            file.replaceWith = file.replaceWith.replace("{{ thisModulesLatestVersion }}", version ? version : this.latest_versions[this.module_name]);
            ret.push(this.writeFile(file, write));
        });
        return ret;
    }
    isForPreRelease() {
        return this.is_for_pre_release;
    }
    async getLatestVersions() {
        let latestVersions = {
            [this.module_name]: "(Module not found)",
            deno: await this.getModulesLatestVersion("deno"),
            deno_std: await this.getModulesLatestVersion("std"),
            drash: await this.getModulesLatestVersion("drash"),
        };
        try {
            latestVersions[this.module_name] = await this.getModulesLatestVersion(this.module_name);
        }
        catch (error) {
        }
        return latestVersions;
    }
    getModuleName() {
        return this.module_name;
    }
    async getModulesLatestVersion(moduleName) {
        const res = await fetch(`https://cdn.deno.land/${moduleName}/meta/versions.json`);
        const version = await res.json();
        return version.latest.replace("v", "");
    }
    getParsedArgs() {
        let args = {};
        this.args.forEach((arg) => {
            if (arg.includes("--version")) {
                args.branch = arg.split("=")[1];
            }
        });
        return args;
    }
    writeFile(file, write = true) {
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
        }
        catch (error) {
            ConsoleLogger.error(error.stack);
        }
        return "";
    }
    replaceVersionVariables(files) {
        files.forEach((file) => {
            file.replaceWith = file.replaceWith.replace("{{ latestDenoVersion }}", this.latest_versions.deno);
            file.replaceWith = file.replaceWith.replace("{{ latestStdVersion }}", this.latest_versions.deno_std);
            file.replaceWith = file.replaceWith.replace("{{ latestDrashVersion }}", this.latest_versions.drash);
        });
        return files;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVtcGVyX3NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJidW1wZXJfc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBcUJsQyxNQUFNLE9BQU8sYUFBYTtJQUlkLElBQUksR0FBYSxFQUFFLENBQUM7SUFNcEIsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBUTNCLGVBQWUsR0FBOEIsRUFBRSxDQUFDO0lBS2hELFdBQVcsQ0FBUztJQUtwQixXQUFXLENBQWE7SUFXbEMsWUFBWSxVQUFrQixFQUFFLElBQWU7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFJOUIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDMUI7UUFHRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUd4QyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBNEJNLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBYSxFQUFFLFFBQWlCLElBQUk7UUFDcEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3RELE1BQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztRQUV6QixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FB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