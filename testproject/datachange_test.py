from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
import string

opt = Options()
opt.headless = True
driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)
driver.get('http://localhost:1667/')
time.sleep(5)

def test_data_change():
    input_data = ["".join([random.choice(string.ascii_lowercase) for _ in range(5)]),
                  f"{random.choice(string.ascii_lowercase)}{random.randint(10, 1000)}@conduit.hu", "Starlord2"]
    test_data = "Can you read me?"

    def registration():
        driver.find_element_by_xpath("//a[@href='#/register']").click()
        time.sleep(5)
        for i in range(len(input_data)):
            driver.find_element_by_xpath(f"//fieldset[{i + 1}]/input").send_keys(input_data[i])
            # time.sleep(2)
        driver.find_element_by_tag_name("button").click()

    registration()
    time.sleep(5)

    driver.find_element_by_xpath("//div[@tabindex='-1']/div/div[4]/div/button").click()

    time.sleep(5)

    driver.find_element_by_xpath("//a[@href='#/settings']").click()
    time.sleep(5)
    driver.find_element_by_tag_name("textarea").send_keys(test_data)
    driver.find_element_by_xpath("//button[@class='btn btn-lg btn-primary pull-xs-right']").click()
    time.sleep(5)
    driver.find_element_by_xpath("//button[@class='swal-button swal-button--confirm']").click()

    assert driver.find_element_by_tag_name("textarea").get_attribute("value") == test_data
    print(f"Text of bio: {driver.find_element_by_tag_name('textarea').get_attribute('value')}")

    time.sleep(5)

    driver.close()
