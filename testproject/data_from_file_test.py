from selenium import webdriver
import time
import random
import csv
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

opt = Options()
opt.headless = True
driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)
driver.get('http://localhost:1667/')
time.sleep(4)


def test_data_from_file():
    input_data = ["L", f"SL{random.randint(10, 1000)}@conduit.hu", "Starlord2."]

    def registration():
        driver.find_element_by_xpath("//a[@href='#/register']").click()
        for i in range(len(input_data)):
            driver.find_element_by_xpath(f"//fieldset[{i + 1}]/input").send_keys(input_data[i])
            time.sleep(3)
        driver.find_element_by_tag_name("button").click()

    registration()
    time.sleep(5)

    driver.find_element_by_xpath("//div[@tabindex='-1']/div/div[4]/div/button").click()
    time.sleep(5)

    def nem_article(title, about, text, tag):
        driver.find_element_by_xpath("//a[@href='#/editor']").click()
        time.sleep(5)
        driver.find_element_by_xpath("//input[@placeholder='Article Title']").send_keys(title)
        driver.find_element_by_xpath("//input[starts-with(@placeholder,'What')]").send_keys(about)
        driver.find_element_by_xpath("//textarea[starts-with(@placeholder,'Write')]").send_keys(text)
        driver.find_element_by_xpath("//input[@placeholder='Enter tags']").send_keys(tag)
        time.sleep(5)
        driver.find_element_by_xpath("//button[@class='btn btn-lg pull-xs-right btn-primary']").click()
        time.sleep(5)

    with open('data_input.csv') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',')
        next(csvreader)
        for row in csvreader:
            print(row)
            nem_article(row[0], row[1], row[2], row[3])

    time.sleep(5)
    driver.close()
