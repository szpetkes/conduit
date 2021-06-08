import { Drash } from "../../mod.ts";
export class Logger {
    configs;
    current_log_message_level_name = "";
    test = false;
    constructor(configs) {
        if (configs.test === true) {
            this.test = true;
        }
        if (configs.enabled !== true) {
            configs.enabled = false;
        }
        configs.level = configs.level ? configs.level.toLowerCase() : "debug";
        if (!Drash.Dictionaries.LogLevels.get(configs.level)) {
            configs.level = "debug";
        }
        if (!configs.tag_string) {
            configs.tag_string = "";
        }
        if (!configs.tag_string_fns) {
            configs.tag_string_fns = {};
        }
        this.configs = configs;
    }
    debug(message) {
        return this.sendToWriteMethod(Drash.Dictionaries.LogLevels.get("debug"), message);
    }
    error(message) {
        return this.sendToWriteMethod(Drash.Dictionaries.LogLevels.get("error"), message);
    }
    fatal(message) {
        return this.sendToWriteMethod(Drash.Dictionaries.LogLevels.get("fatal"), message);
    }
    info(message) {
        return this.sendToWriteMethod(Drash.Dictionaries.LogLevels.get("info"), message);
    }
    trace(message) {
        return this.sendToWriteMethod(Drash.Dictionaries.LogLevels.get("trace"), message);
    }
    warn(message) {
        return this.sendToWriteMethod(Drash.Dictionaries.LogLevels.get("warn"), message);
    }
    getTagStringParsed() {
        if (this.configs.tag_string && this.configs.tag_string.trim() == "") {
            return "";
        }
        let tagString = this.configs.tag_string;
        if (!tagString) {
            return "";
        }
        try {
            tagString = tagString.replace("{level}", this.current_log_message_level_name);
        }
        catch (error) {
        }
        for (let key in this.configs.tag_string_fns) {
            let tag = `{${key}}`;
            tagString = tagString.replace(tag, this.configs.tag_string_fns[key]);
        }
        return tagString + " ";
    }
    sendToWriteMethod(logMethodLevelDefinition, message) {
        if (!this.configs.enabled) {
            return;
        }
        if (!this.configs.level) {
            return;
        }
        const key = this.configs.level ? this.configs.level : "";
        const level = Drash.Dictionaries.LogLevels.get(key);
        if (!level) {
            return;
        }
        if (logMethodLevelDefinition.rank > level.rank) {
            return;
        }
        this.current_log_message_level_name = logMethodLevelDefinition.name
            .toUpperCase();
        return this.write(logMethodLevelDefinition, this.getTagStringParsed() + message);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFLckMsTUFBTSxPQUFnQixNQUFNO0lBSWhCLE9BQU8sQ0FBaUM7SUFLeEMsOEJBQThCLEdBQVcsRUFBRSxDQUFDO0lBSzVDLElBQUksR0FBWSxLQUFLLENBQUM7SUFXaEMsWUFBWSxPQUF1QztRQUNqRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLElBQUksRUFBRTtZQUM1QixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztTQUN6QjtRQUVELE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdkIsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDekI7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUMzQixPQUFPLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztTQUM3QjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUE2Qk0sS0FBSyxDQUFDLE9BQWU7UUFDMUIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQzNCLEtB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