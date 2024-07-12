YouTube Watch Later Automation

Description:
This project automates the extraction and processing of videos from a YouTube "Watch Later" playlist. It uses Selenium WebDriver to control a Firefox browser session, navigate to the playlist, scroll to load all videos, extract video details (title, URL, and uploader), and save this information to a CSV file. The script can also remove videos from the playlist after extraction.

Technologies Used:

    JavaScript (Node.js)
    Selenium WebDriver
    Firefox (geckodriver)
    CSV Writer (csv-writer)

Key Features:

    Automation: Automates browser interactions using Selenium.
    Data Extraction: Extracts video details from YouTube.
    Data Processing: Writes extracted data to a CSV file.
    Error Handling: Robust handling of dynamic web elements and pagination.
    Session Management: Uses an existing Firefox session to avoid automated login restrictions.

Challenges Overcome:

    Dynamic Content Handling: Successfully managed dynamic content loading and pagination.
    Robustness: Implemented comprehensive error handling to ensure reliability.
    Scalability: Efficiently managed large datasets with thousands of entries.


I wrote this script to automate the process of cleaning out my youtube 
watch later playlist but I wanted to also be able to save those videos 
to rewatch later in case I needed to revisit. I hope this is as useful 
to you as it has been for me! I welcome any advice you have.
