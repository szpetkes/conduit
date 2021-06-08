const decoder = new TextDecoder("utf-8");
export class Jae {
    views_path = "";
    constructor(viewsPath) {
        this.views_path = viewsPath;
    }
    render(template, data) {
        let code = "with(obj) { var r=[];\n";
        let cursor = 0;
        let match;
        const filepath = this.views_path + template;
        let html = decoder.decode(Deno.readFileSync(filepath));
        const extended = html.match(/<% extends.* %>/g);
        if (extended) {
            extended.forEach((m, i) => {
                html = html.replace(m, "");
                let template = m.replace('<% extends("', "").replace('") %>', "");
                template = decoder.decode(Deno.readFileSync(this.views_path + template));
                html = template.replace("<% yield %>", html);
            });
        }
        let partials;
        while ((partials = html.match(/<% include_partial.* %>/g))) {
            partials.forEach((m, i) => {
                let template = m
                    .replace('<% include_partial("', "")
                    .replace('") %>', "");
                template = decoder.decode(Deno.readFileSync(this.views_path + template));
                html = html.replace(m, template);
            });
        }
        const re = /<%(.+?)\%>/g;
        const reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g;
        let result;
        function add(line, js = null) {
            js
                ? (code += line.match(reExp) ? line + "\n" : "r.push(" + line + ");\n")
                : (code += line != ""
                    ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n'
                    : "");
            return add;
        }
        while ((match = re.exec(html))) {
            add(html.slice(cursor, match.index));
            add(match[1], true);
            cursor = match.index + match[0].length;
        }
        add(html.substr(cursor, html.length - cursor));
        code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, " ");
        try {
            if (!data) {
                data = {};
            }
            result = new Function("obj", code).apply(data, [data]);
        }
        catch (err) {
            console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiamFlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXpDLE1BQU0sT0FBTyxHQUFHO0lBS1AsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQVl2QixZQUFZLFNBQWlCO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUF5Qk0sTUFBTSxDQUFDLFFBQWdCLEVBQUUsSUFBYTtRQUMzQyxJQUFJLElBQUksR0FBRyx5QkFBeUIsQ0FBQztRQUNyQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLEtBQUssQ0FBQztRQUNWLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFXLE9BQU8sQ0FBQyxNQUFNLENBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQzVCLENBQUM7UUFHRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEQsSUFBSSxRQUFRLEVBQUU7WUFDWixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ2xFLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQzlDLENBQUM7Z0JBQ0Ys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