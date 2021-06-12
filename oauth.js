const crypto = require("crypto");
const oauth1a = require("oauth-1.0a");

const CONSUMER_KEY = process.env.TWITTER_API_KEY;
const CONSUMER_SECRET_KEY = process.env.TWITTER_API_SECRET_KEY;
const ACCESS_TOKEN_KEY = process.env.TWITTER_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

class Oauth1Helper {
  static getAuthHeaderForRequest(request) {
    const oauth = oauth1a({
      consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET_KEY },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha1", key)
          .update(base_string)
          .digest("base64");
      },
    });

    const authorization = oauth.authorize(request, {
      key: ACCESS_TOKEN_KEY,
      secret: ACCESS_TOKEN_SECRET,
    });

    return oauth.toHeader(authorization);
  }
}

module.exports = Oauth1Helper;
