import express from "express";
import short from "shortid";
import { createUrl, getShortUrl, getUrl } from "./index.js";

const router = express.Router();

router.route("/shortner").post(async (request, response) => {
  const { url } = request.body;
  const shortId = short();
  console.log(shortId);
  const longUrl = await createUrl(url, shortId);
  const urlData = await getShortUrl(url);
  const shortUrl = urlData.shortId;
  const newUrl = `https://nodeurlapp.herokuapp.com/urlshort/${shortUrl}`;
  response.send(newUrl);
});

router.route("/:shortId").get(async (request, response) => {
  const { shortId } = request.params;
  const urlData = await getUrl(shortId);
  const orgUrl = `https://${urlData.url}`;
  console.log(orgUrl);
  response.redirect(orgUrl);
});

export const urlShortRouter = router;
