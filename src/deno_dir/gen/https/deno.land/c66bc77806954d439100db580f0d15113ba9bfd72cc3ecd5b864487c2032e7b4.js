const encoder = new TextEncoder();
export class TestCase {
    plan;
    constructor(plan) {
        this.plan = plan;
    }
    async run() {
        if (this.plan.hasOwnProperty("suites") === false) {
            return;
        }
        let executedBeforeAllSuiteHook = false;
        let executedAfterAllSuiteHook = false;
        Object.keys(this.plan.suites).forEach((suiteName, suiteIndex) => {
            let executedBeforeEachSuiteHook = false;
            let executedAfterEachSuiteHook = false;
            let executedBeforeAllCaseHook = false;
            let executedAfterAllCaseHook = false;
            this.plan.suites[suiteName].cases.forEach(async (c, caseIndex) => {
                const hookAttachedTestFn = async () => {
                    if (this.plan.before_all_suite_hook && !executedBeforeAllSuiteHook) {
                        await this.plan.before_all_suite_hook();
                        executedBeforeAllSuiteHook = true;
                    }
                    if (this.plan.before_each_suite_hook && !executedBeforeEachSuiteHook) {
                        await this.plan.before_each_suite_hook();
                        executedBeforeEachSuiteHook = true;
                    }
                    if (this.plan.suites[suiteName].before_all_case_hook &&
                        !executedBeforeAllCaseHook) {
                        await this.plan.suites[suiteName].before_all_case_hook();
                        executedBeforeAllCaseHook = true;
                    }
                    if (this.plan.suites[suiteName].before_each_case_hook) {
                        await this.plan.suites[suiteName].before_each_case_hook();
                    }
                    await c.testFn();
                    if (this.plan.suites[suiteName].after_each_case_hook) {
                        await this.plan.suites[suiteName].after_each_case_hook();
                    }
                    const isLastCase = (this.plan.suites[suiteName].cases.length - 1) == caseIndex;
                    if (this.plan.suites[suiteName].after_all_case_hook &&
                        !executedAfterAllCaseHook && isLastCase) {
                        await this.plan.suites[suiteName].after_all_case_hook();
                        executedAfterAllCaseHook = true;
                    }
                    if (this.plan.after_each_suite_hook && !executedAfterEachSuiteHook) {
                        await this.plan.after_each_suite_hook();
                        executedAfterEachSuiteHook = true;
                    }
                    const isLastSuite = (Object.keys(this.plan.suites).length - 1) == suiteIndex;
                    if (this.plan.after_all_suite_hook && !executedAfterAllSuiteHook &&
                        isLastSuite) {
                        await this.plan.after_all_suite_hook();
                        executedAfterAllSuiteHook = true;
                    }
                };
                if (Deno.env.get("CI") === "true") {
                    await Deno.test(c.new_name, async () => {
                        await hookAttachedTestFn();
                    });
                }
                else {
                    await Deno.test(c.name, async () => {
                        Deno.stdout.writeSync(encoder.encode(c.new_name));
                        await hookAttachedTestFn();
                    });
                }
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9jYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVzdF9jYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7QUFNbEMsTUFBTSxPQUFPLFFBQVE7SUFJVCxJQUFJLENBQVk7SUFLMUIsWUFBWSxJQUFlO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFLTSxLQUFLLENBQUMsR0FBRztRQUVkLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQ2hELE9BQU87U0FDUjtRQUdELElBQUksMEJBQTBCLEdBQUcsS0FBSyxDQUFDO1FBQ3ZDLElBQUkseUJBQXlCLEdBQUcsS0FBSyxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEVBQUU7WUFFOUQsSUFBSSwyQkFBMkIsR0FBRyxLQUFLLENBQUM7WUFDeEMsSUFBSSwwQkFBMEIsR0FBRyxLQUFLLENBQUM7WUFDdkMsSUFBSSx5QkFBeUIsR0FBRyxLQUFLLENBQUM7WUFDdEMsSUFBSSx3QkFBd0IsR0FBRyxLQUFLLENBQUM7WUFHckMsSUFBSSxDQUFDLElBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBTSxDQUFDLE9BQU8sQ0FDekMsS0FBSyxFQUFFLENBQVksRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFJaEMsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLElBQUksRUFBRTtvQkFDcEMsSUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixJQUFJLENBQUMsMEJBQTBCLEVBQzlEO3dCQUNBLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO3dCQUN4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