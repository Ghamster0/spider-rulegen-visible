import scrapy
from scrapy.linkextractors import LinkExtractor
import json, os


class HybridSpider(scrapy.Spider):
    name = 'hybrid'

    def __init__(self, name=None, **kwargs):
        super().__init__(name, **kwargs)
        with open("rules.json", "r") as f:
            self.rules = json.load(f)

    def start_requests(self):
        for site in self.rules:
            for rule in site["rules"]:
                if "startUrls" in rule:
                    for url in rule["startUrls"]:
                        yield scrapy.Request(url, meta={"rules": site["rules"], "curr_rule": rule})

    def parse(self, response):
        curr_rule = response.meta["curr_rule"]
        rules = response.meta["rules"]

        if "contents" in curr_rule and len(curr_rule["contents"])>0:
            contents = curr_rule["contents"]
            for c in contents:
                if c["type"] == "document":
                    print("save page: ", response.url)
        
        if "links" in curr_rule and len(curr_rule["links"])>0:
            links = curr_rule["links"]
            for link in links:
                handler_rule = None
                for r in rules:
                    if r["id"] == link["handler"]:
                        handler_rule = r
                        break
                if handler_rule is None:
                    print("handler not find: ", link["handler"])
                    break

                extractor = LinkExtractor(restrict_css=link["selector"])
                for l in extractor.extract_links(response):
                    yield scrapy.Request(l.url, meta={"rules": rules, "curr_rule": handler_rule})

