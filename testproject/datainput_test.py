from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import random

options = Options()
options.headless = True
options.add_argument('--disable-gpu')


def test_data_input():
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
    driver.get('http://localhost:1667/')

    input_data = ["L", f"SL{random.randint(10, 1000)}@conduit.hu", "Starlord2."]

    def registration_process():
        driver.find_element_by_xpath("//a[@href='#/register']").click()
        for i in range(len(input_data)):
            driver.find_element_by_xpath(f"//fieldset[{i + 1}]/input").send_keys(input_data[i])
        driver.find_element_by_tag_name("button").click()
    registration_process()
    time.sleep(3)

    driver.find_element_by_xpath("//div[@tabindex='-1']/div/div[4]/div/button").click()
    time.sleep(2)

    driver.close()
