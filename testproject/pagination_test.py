from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

opt = Options()
opt.headless = True


def test_pagination():
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)
    driver.get('http://localhost:1667/')

    input_data = ["testuser3", "testuser3@example.com", "Abcd123$"]
    number_of_pages_start = 4

    def login_process():
        driver.find_element_by_xpath("//a[@href='#/login']").click()
        for i in range(len(input_data) - 1):
            driver.find_element_by_xpath(f"//fieldset[{i + 1}]/input").send_keys(input_data[i + 1])
            time.sleep(1)
        driver.find_element_by_tag_name("button").click()
    login_process()
    time.sleep(2)

    pages = driver.find_elements_by_class_name("page-link")
    print(len(pages))

    for page in pages:
        page.click()
        time.sleep(1)

    assert len(pages) == number_of_pages_start

    driver.close()
