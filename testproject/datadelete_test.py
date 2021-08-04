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


def test_data_delete():
    input_data = ["".join([random.choice(string.ascii_lowercase) for _ in range(5)]),
                  f"{random.choice(string.ascii_lowercase)}{random.randint(10, 1000)}@conduit.hu", "Starlord2."]
    data1 = [f"1_title_{random.randint(10, 1000)}", "1_about", "1_text", "1_tag"]
    data2 = [f"2_title_{random.randint(10, 1000)}", "2_about", "2_text", "2_tag"]

    def registration_process():
        driver.find_element_by_xpath("//a[@href='#/register']").click()
        time.sleep(5)
        for i in range(len(input_data)):
            driver.find_element_by_xpath(f"//fieldset[{i + 1}]/input").send_keys(input_data[i])
        driver.find_element_by_tag_name("button").click()

    registration_process()
    time.sleep(5)

    driver.find_element_by_xpath("//div[@tabindex='-1']/div/div[4]/div/button").click()
    time.sleep(5)

    def new_article(input_title, input_about, input_text, input_tag):
        driver.find_element_by_xpath("//a[@href='#/editor']").click()
        time.sleep(2)
        driver.find_element_by_xpath("//input[@placeholder='Article Title']").send_keys(input_title)
        driver.find_element_by_xpath("//input[starts-with(@placeholder,'What')]").send_keys(input_about)
        driver.find_element_by_xpath("//textarea[starts-with(@placeholder,'Write')]").send_keys(input_text)
        driver.find_element_by_xpath("//input[@placeholder='Enter tags']").send_keys(input_tag)
        driver.find_element_by_xpath("//button[@class='btn btn-lg pull-xs-right btn-primary']").click()

    new_article(data1[0], data1[1], data1[2], data1[3])
    time.sleep(5)

    print(driver.find_element_by_tag_name("h1").text)
    assert driver.find_element_by_tag_name("h1").text == data1[0]
    time.sleep(5)
    user = driver.find_element_by_xpath("//*[@id='app']/nav/div/ul/li[4]/a")
    user.click()
    time.sleep(5)
    assert len(driver.find_elements_by_xpath("//h1")) == 1
    time.sleep(5)

    new_article(data2[0], data2[1], data2[2], data2[3])
    time.sleep(5)

    print(driver.find_element_by_tag_name("h1").text)
    assert driver.find_element_by_tag_name("h1").text == data2[0]
    user.click()
    time.sleep(5)
    assert len(driver.find_elements_by_xpath("//h1")) == 2
    time.sleep(5)
    driver.find_element_by_xpath("/html/body/div[1]/div/div[2]/div/div/div[2]/div/div/div[2]/a/h1").click()
    time.sleep(5)

    driver.find_element_by_xpath("//*[@id='app']/div/div[1]/div/div/span/button").click()
    time.sleep(5)
    user.click()

    driver.close()
