from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

options = Options()
options.headless = True
options.add_argument('--disable-gpu')


def test_data_list():
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
    driver.get('http://localhost:1667/')
    input_data = ["testuser2", "testuser2@example.com", "Abcd123$"]

    def login_process():
        driver.find_element_by_xpath("//a[@href='#/login']").click()
        for i in range(len(input_data) - 1):
            driver.find_element_by_xpath(f"//fieldset[{i + 1}]/input").send_keys(input_data[i + 1])
            time.sleep(1)
        driver.find_element_by_tag_name("button").click()
    login_process()
    time.sleep(2)

    signed_up_user = driver.find_element_by_xpath("//li[@class='nav-item'][4]/a")
    signed_up_user.click()
    time.sleep(3)
    article_title_list = driver.find_elements_by_xpath("//div[@class='article-preview']/a/h1")
    for item in article_title_list:
        print(item.text)

    assert len(article_title_list) == 2

    time.sleep(2)
    driver.close()
