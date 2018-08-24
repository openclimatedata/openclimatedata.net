import jinja2
import json
import yaml

from pathlib import Path

parent = Path(__file__).parents[0] / ".."

data = yaml.load(open("data.yaml"))

loader = jinja2.FileSystemLoader(searchpath=".")

env = jinja2.Environment(loader=loader)

TEMPLATE_FILE = "template.html"

template = env.get_template(TEMPLATE_FILE)

for group in data:
    for item in group["items"]:
        if "repo" in item:
            path = parent / item["repo"] / "datapackage.json"
            dp = json.load(open(str(path), "r"))
            item["title"] = dp["title"]
            if "description" in dp:
                item["description"] = dp["description"]

output = template.render(data=data)

with open("index.html", "w") as f:
    f.write(output)
