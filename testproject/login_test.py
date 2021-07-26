from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from random import randint
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')

# driver = webdriver.Chrome(ChromeDriverManager().install())
driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)  # headless mód


def find_elem_and_click(xp):
    driver.find_element_by_xpath(xp).click()


def fill_input_fields(my_list, field_list, xp):  # fill in input fields
    for _ in range(len(my_list)):
        field_list[_].send_keys(my_list[_])
    time.sleep(3)
    driver.find_element_by_xpath(xp).click()
# -----------------------------------------------------------------------------------------


# A010, CON_TC04_Sikeres login(létező user)
def test_successful_login():
    url = "http://localhost:1667"
    driver.get(url)
    time.sleep(3)

    # successful registration
    find_elem_and_click('//li[@class="nav-item"]/a[@href="#/register"]')  # sign up
    time.sleep(3)

    reg_input_fields = WebDriverWait(driver, 5).until(EC.visibility_of_all_elements_located((By.TAG_NAME, 'input')))
    random_user = f"Simone{randint(1,100)}"
    reg_input_data = [random_user, f"{random_user}@gmail.com", "12ABab@&"]

    fill_input_fields(reg_input_data, reg_input_fields, '//button[contains(text(),"Sign up")]')
    swal_btn = WebDriverWait(driver, 5).until(EC.visibility_of_element_located
                                              ((By.XPATH, '//div[@class="swal-button-container"]/button')))
    swal_btn.click()
    time.sleep(3)
    find_elem_and_click('//nav/div/ul//li/a[@active-class="active"]')  # logout
    time.sleep(3)

    # successful login
    find_elem_and_click('//li[@class="nav-item"]/a[@href="#/login"]')
    time.sleep(3)
    log_input_fields = WebDriverWait(driver, 5).until(EC.visibility_of_all_elements_located((By.TAG_NAME, 'input')))
    login_data = [reg_input_data[1], "12ABab@&"]
    expected_user_login_text = "Logging you in... Please wait..."
    fill_input_fields(login_data, log_input_fields, '//button[contains(text(),"Sign in")]')
    assert expected_user_login_text == driver.find_element_by_xpath('//div[@class="swal-text"]').text
    time.sleep(3)

    assert driver.current_url == 'http://localhost:1667/#/'
    nav_bar_links = WebDriverWait(driver, 5).until(EC.visibility_of_all_elements_located
                                                   ((By.XPATH, '//nav//div[@class="container"]/ul/li')))
    expected_login_nav_bar_elements = ['Home', ' New Article', ' Settings', reg_input_data[0], ' Log out']

    def compare_the_text_of_two_lists(real_list, expected_list):
        for _ in range(len(real_list)):
            assert real_list[_].text == expected_list[_]

    compare_the_text_of_two_lists(nav_bar_links, expected_login_nav_bar_elements)  # check navbar elements
    time.sleep(2)
    find_elem_and_click('//nav/div/ul//li/a[@active-class="active"]')  # logout