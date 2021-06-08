import { Logger } from "./logger.ts";
export class FileLogger extends Logger {
    file = "tmp_log.log";
    constructor(configs) {
        super(configs);
        if (configs.file) {
            this.file = configs.file;
        }
    }
    write(logMethodLevelDefinition, message) {
        const encoder = new TextEncoder();
        let encoded = encoder.encode(message + "\n");
        if (this.test) {
            return message;
        }
        Deno.writeFileSync(this.file, encoded, { append: true });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZV9sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlX2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBS3JDLE1BQU0sT0FBTyxVQUFXLFNBQVEsTUFBTTtJQUkxQixJQUFJLEdBQVcsYUFBYSxDQUFDO0lBT3ZDLFlBQVksT0FBdUM7UUFDakQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztTQUMxQjtJQUNILENBQUM7SUFhTSxLQUFLLENBQ1Ysd0JBQTRELEVBQzVELE9BQWU7UUFFZixNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDRiJ9