from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
import string

opt = Options()
opt.headless = True


def test_logout():
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)
    driver.get('http://localhost:1667/')
    time.sleep(2)

    input_data = ["".join([random.choice(string.ascii_lowercase) for _ in range(5)]),
                  f"{random.choice(string.ascii_lowercase)}{random.randint(10, 1000)}@conduit.hu", "Starlord2."]

    def registration_process():
        driver.find_element_by_xpath("//a[@href='#/register']").click()
        for i in range(len(input_data)):
            driver.find_element_by_xpath(f"//fieldset[{i + 1}]/input").send_keys(input_data[i])
        driver.find_element_by_tag_name("button").click()

    registration_process()
    time.sleep(2)
    driver.find_element_by_xpath("//div[@tabindex='-1']/div/div[4]/div/button").click()
    time.sleep(2)

    username = driver.find_element_by_xpath("//li[@class='nav-item'][4]/a")
    print(username.text)
    assert username.text == input_data[0]

    navbar_logged_in = driver.find_elements_by_xpath("//*[@id='app']/nav/div/ul/li/a")
    for element in navbar_logged_in:
        print(element.text)
    assert navbar_logged_in[3].text == input_data[0]

    log_out_link = driver.find_element_by_xpath("//a[@active-class='active']")
    log_out_link.click()

    navbar_logged_out = driver.find_elements_by_xpath("//*[@id='app']/nav/div/ul/li/a")
    for element in navbar_logged_out:
        print(element.text)
    assert navbar_logged_out[2].text == "Sign up"

    time.sleep(2)
    driver.close()
