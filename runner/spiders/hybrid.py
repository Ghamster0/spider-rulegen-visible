import scrapy
import json


class HybridSpider(scrapy.Spider):
    name = 'hybrid'

    def start_urls(self):
        with open("rules.json", "r") as f:
            rules = json.load
    start_urls = ['http://www.baidu.com/']

    def parse(self, response):
        pass
