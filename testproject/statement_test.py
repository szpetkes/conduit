from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

opt = Options()
opt.headless = True


def test_statement():
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=opt)
    driver.get('http://localhost:1667/')
    time.sleep(2)

    driver.find_element_by_xpath(
        "//button[@class='cookie__bar__buttons__button cookie__bar__buttons__button--accept']").click()

    time.sleep(2)
    driver.close()
