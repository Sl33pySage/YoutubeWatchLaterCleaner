const { By, Builder, until, Key } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const fs = require("fs-extra");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
require("geckodriver");

// Function to attach to an existing Chrome browser session
async function attachToSession(userDataDir) {
  const options = new firefox.Options().setProfile(userDataDir);
  return new Builder().forBrowser("firefox").setFirefoxOptions(options).build();
}

// Function navigate to the "Watch Later" playlist
async function navigateToWatchLater(driver) {
  await driver.get("https://www.youtube.com/playlist?list=WL");
  await driver.sleep(3000); // Let the page load
}

// Function to scroll to the bottom of the page to load more videos
async function scrollToBottom(driver) {
  let lastHeight = await driver.executeScript(
    "return document.documentElement.scrollHeight",
  );
  while (true) {
    await driver.executeScript(
      "window.scrollTo(0, document.documentElement.scrollHeight);",
    );
    await driver.sleep(60000); // Wait for the page to load

    let newHeight = await driver.executeScript(
      "return document.documentElement.scrollHeight",
    );
    if (newHeight === lastHeight) {
      break;
    }
    lastHeight = newHeight;
  }
}

// Function to extract video details
async function extractVideoDetails(driver) {
  let videos = [];
  let videoElements = await driver.findElements(
    By.css("ytd-playlist-video-renderer"),
  );

  for (let videoElement of videoElements) {
    let titleElement = await videoElement.findElement(By.id("video-title"));
    let title = await titleElement.getText();
    let url = await titleElement.getAttribute("href");
    let uploaderElement = await videoElement.findElement(
      By.css("ytd-channel-name a"),
    );
    let uploader = await uploaderElement.getText();

    videos.push({ title, url, uploader });
  }

  return videos;
}

// Function to write video details to a CSV file
async function writeToCSV(videos) {
  const csvWriter = createCsvWriter({
    path: "watch_later_playlist.csv",
    header: [
      { id: "title", title: "Title" },
      { id: "url", title: "URL" },
      { id: "uploader", title: "Uploader" },
    ],
  });

  await csvWriter.writeRecords(videos);
  console.log("Data written to watch_later_playlist.csv");
}

// Function to remove videos from the "Watch Later" playlist using Javascript
async function removeVideosFromWatchLater(driver) {
  let videoElements = await driver.findElements(
    By.css("ytd-playlist-video-renderer"),
  );

  for (let videoElement of videoElements) {
    try {
      let menuButton = await videoElement.findElement(By.css("#menu #button"));
      await driver.executeScript(
        "arguments[0].scrollIntoView({block: 'center'});",
        menuButton,
      );
      await driver.sleep(500);

      await driver.wait(until.elementIsVisible(menuButton), 10000);
      await driver.wait(until.elementIsEnabled(menuButton), 10000);

      try {
        await menuButton.click();
      } catch (error) {
        console.log("Retrying click...");
        await driver.executeScript("arguments[0].click();", menuButton);
      }

      //await menuButton.click();
      await driver.sleep(1000); // Wait for the menu to appear

      let removeButton = await driver.wait(
        until.elementLocated(
          By.css(
            "ytd-menu-service-item-renderer.style-scope:nth-child(3) > tp-yt-paper-item:nth-child(1)",
          ),
        ),
        10000,
      );

      await driver.executeScript(
        "arguments[0].scrollIntoView({block: 'center'});",
        removeButton,
      );
      await driver.sleep(500);

      await driver.wait(until.elementIsVisible(removeButton), 10000);
      await driver.wait(until.elementIsEnabled(removeButton), 10000);

      try {
        await removeButton.click();
      } catch (error) {
        console.log("Retrying click...");
        await driver.executeScript("arguments[0].click();", removeButton);
      }

      // await removeButton.click();
      await driver.sleep(1000); // Wait for the video to be removed
    } catch (error) {
      console.error("Error removing video:", error);
    }
  }
}

(async function () {
  const userDataDir = "Replace/With/Path/To/Your/Browser/Profile";
  let driver = await attachToSession(userDataDir);

  try {
    await navigateToWatchLater(driver);
    await scrollToBottom(driver); // Load all videos by scrolling to the bottom
    let videos = await extractVideoDetails(driver);
    await writeToCSV(videos);

    // Optional: Uncomment to delete videos after extracting details
    // await removeVideosFromWatchLater(driver);
    //console.log(
    // "Process completed. Video details extracted and saved to watch_later_playlist.csv",
    //);
  } finally {
    await driver.quit();
  }
})();
