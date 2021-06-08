import { asserts } from "./src/rhum_asserts.ts";
import { MockServerRequestFn } from "./src/mocks/server_request.ts";
import { TestCase } from "./src/test_case.ts";
import { MockBuilder } from "./src/mock_builder.ts";
export { MockBuilder } from "./src/mock_builder.ts";
const extraChars = 10;
export class RhumRunner {
    asserts = asserts;
    mocks;
    passed_in_test_plan = "";
    passed_in_test_suite = "";
    test_plan_in_progress = "";
    test_suite_in_progress = "";
    plan = { suites: {} };
    constructor() {
        this.mocks = { ServerRequest: MockServerRequestFn };
    }
    beforeEach(cb) {
        if (this.passed_in_test_plan && this.passed_in_test_suite) {
            this.plan.suites[this.passed_in_test_suite].before_each_case_hook = cb;
        }
        else if (this.passed_in_test_plan && !this.passed_in_test_suite) {
            this.plan.before_each_suite_hook = cb;
        }
    }
    afterEach(cb) {
        if (this.passed_in_test_plan && this.passed_in_test_suite) {
            this.plan.suites[this.passed_in_test_suite].after_each_case_hook = cb;
        }
        else if (this.passed_in_test_plan && !this.passed_in_test_suite) {
            this.plan.after_each_suite_hook = cb;
        }
    }
    afterAll(cb) {
        if (this.passed_in_test_plan && this.passed_in_test_suite) {
            this.plan.suites[this.passed_in_test_suite].after_all_case_hook = cb;
        }
        else if (this.passed_in_test_plan && !this.passed_in_test_suite) {
            this.plan.after_all_suite_hook = cb;
        }
    }
    beforeAll(cb) {
        if (this.passed_in_test_plan && this.passed_in_test_suite) {
            this.plan.suites[this.passed_in_test_suite].before_all_case_hook = cb;
        }
        else if (this.passed_in_test_plan && !this.passed_in_test_suite) {
            this.plan.before_all_suite_hook = cb;
        }
    }
    skip(name, cb) {
    }
    stubbed(obj) {
        obj.is_stubbed = true;
        obj.stub = function (property, value) {
            Object.defineProperty(obj, property, {
                value: value,
            });
        };
        return obj;
    }
    mock(constructorFn) {
        return new MockBuilder(constructorFn);
    }
    testCase(name, testFn) {
        this.plan.suites[this.passed_in_test_suite].cases.push({
            name,
            new_name: this.formatTestCaseName(name),
            testFn,
        });
    }
    testPlan(name, testSuites) {
        this.passed_in_test_suite = "";
        this.passed_in_test_plan = name;
        testSuites();
    }
    testSuite(name, testCases) {
        this.passed_in_test_suite = name;
        this.plan.suites[name] = { cases: [] };
        testCases();
    }
    run() {
        const tc = new TestCase(this.plan);
        tc.run();
        this.deconstruct();
    }
    formatTestCaseName(name) {
        let newName;
        if (Deno.env.get("CI") === "true") {
            newName =
                `${this.passed_in_test_plan} | ${this.passed_in_test_suite} | ${name}`;
            return newName;
        }
        if (this.test_plan_in_progress != this.passed_in_test_plan) {
            this.test_plan_in_progress = this.passed_in_test_plan;
            this.test_suite_in_progress = this.passed_in_test_suite;
            newName = `${"\u0008".repeat(name.length + extraChars)}` +
                `${" ".repeat(name.length + extraChars)}` +
                `\n${this.passed_in_test_plan}` +
                `\n    ${this.passed_in_test_suite}` +
                `\n        ${name} ... `;
        }
        else {
            if (this.test_suite_in_progress != this.passed_in_test_suite) {
                this.test_suite_in_progress = this.passed_in_test_suite;
                newName = `${"\u0008".repeat(name.length + extraChars)}` +
                    `    ${this.passed_in_test_suite}` +
                    `${" ".repeat(name.length + extraChars)}` +
                    `\n        ${name} ... `;
            }
            else {
                newName = `${"\u0008".repeat(name.length + extraChars)}` +
                    `        ${name} ... `;
            }
        }
        return newName;
    }
    deconstruct() {
        this.passed_in_test_suite = "";
        this.passed_in_test_plan = "";
        this.test_plan_in_progress = "";
        this.test_suite_in_progress = "";
        this.plan = { suites: {} };
    }
}
export const Rhum = new RhumRunner();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBR3BELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQVFwRCxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFtQ3RCLE1BQU0sT0FBTyxVQUFVO0lBU2QsT0FBTyxHQUFzQyxPQUFPLENBQUM7SUFFckQsS0FBSyxDQUFZO0lBRWQsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0lBRXpCLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztJQUUxQixxQkFBcUIsR0FBRyxFQUFFLENBQUM7SUFFM0Isc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0lBRTVCLElBQUksR0FBYyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQztJQU8zQztRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBMkJNLFVBQVUsQ0FBQyxFQUFjO1FBRTlCLElBQUksSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUV6RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxxQkFBcUIsR0FBRyxFQUFFLENBQUM7U0FDekU7YUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUVqRSxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUs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