import { Logger } from "./logger.ts";
export class ConsoleLogger extends Logger {
    constructor(configs) {
        super(configs);
    }
    write(logMethodLevelDefinition, message) {
        if (this.test) {
            return message;
        }
        console.log(message);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZV9sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zb2xlX2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBS3JDLE1BQU0sT0FBTyxhQUFjLFNBQVEsTUFBTTtJQVV2QyxZQUFZLE9BQXVDO1FBQ2pELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBaUJNLEtBQUssQ0FDVix3QkFBNEQsRUFDNUQsT0FBZTtRQUVmLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLE9BQU8sT0FBTyxDQUFDO1NBQ2hCO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0YifQ==