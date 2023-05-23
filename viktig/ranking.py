from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from bs4 import BeautifulSoup
import pandas as pd
import time

# The URL of the page you want to scrape
url = 'https://badmintonportalen.no/NBF/Ranglister/'

# Create a new WebDriver instance
driver = webdriver.Chrome()

# Navigate to the page
driver.get(url)

wait = WebDriverWait(driver, 10)

categories = range(1, 7)  # The numbers used in the SelectRankingList(n) function

for category in categories:
    # Call the SelectRankingList(n) function to switch to a different category
    driver.execute_script(f'SelectRankingList({category})')

    # Wait for the page to load
    time.sleep(0.5)

    # Get the name of the current tab
    tab_name = driver.find_element(By.CSS_SELECTOR, f'div.smallTabSelected a').text

    data = []
    page_number = 0
    while True:
        # Wait for the table to load
        try:
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'RankingListGrid')))
        except TimeoutException:
            break  # if we can't find the table after waiting, we're done

        # Get the HTML of the page
        html = driver.page_source

        # Parse the HTML with BeautifulSoup
        soup = BeautifulSoup(html, 'html.parser')

        # Find the table containing the rankings on the page
        table = soup.find('table', {'class': 'RankingListGrid'})

        # Get the headers of the table if not done already
        if not data:
            headers = [header.text.strip() for header in table.find_all('th')]

        # Get the rows of the table
        rows = table.find_all('tr')[1:]  # skip the header row

        # Get the data in each row, excluding the row with page numbers
        data.extend([[cell.text.strip() for cell in row.find_all('td')] for row in rows if not row.find('td', {'colspan': '5'})])

        # Try to find the link to the next page
        try:
            next_link = driver.find_element(By.CSS_SELECTOR, f'a[onclick="return SelectRankingListPage({page_number+1});"]')
        except NoSuchElementException:
            break  # if we can't find a link to the next page, we're done

        # Click the link to the next page
        next_link.click()

        # Wait for the page to load
        time.sleep(0.5)

        # Increment the page number
        page_number += 1

    # Create a pandas DataFrame from the data
    df = pd.DataFrame(data, columns=headers)

    # Remove rows with empty values (",,,")
    df = df.replace(r'^\s*,\s*$', '', regex=True)

    # Drop rows that contain only empty values
    df = df.dropna(how='all')

    # Save the DataFrame to a CSV file with the name of the current tab
    df.to_csv(f'rankings_{category}_{tab_name}.csv', index=False)

# Close the WebDriver instance
driver.quit()
