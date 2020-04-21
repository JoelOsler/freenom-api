if (process.argv.length === 2) {
  console.error("freenom <email> <password> <domain id>");
  process.exit(1);
} else if (process.argv.length !== 5) {
  console.error("freenom <email> <password> <domain id>");
  process.exit(1);
}
var request = require("request");

var cookiekey;

function uuid() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function login(email, password) {
  console.log("Please wait, this might take a few minutes.\n");
  var headers = {
    "Accept-Language": "en-us",
    Host: "my.freenom.com",
    Origin: "https://my.freenom.com",
    "Content-Length": "101",
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15",
    Referer: "https://my.freenom.com/clientarea.php",
    Connection: "keep-alive",
    Cookie:
      "__utma=76711234.1108268304.1586306810.1586306810.1586306810.1; __utmb=76711234.22.10.1586306810; __utmc=76711234; __utmt=1; __utmz=76711234.1586306810.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); G_ENABLED_IDPS=google; dottyLn=en; mydottk_languagenr=0; wwwLn=en; WHMCSZH5eHTGhfvzP=i0qmhfdpg7jpv76mhjj2sp8so2; __zlcmid=xcj2mdhKwtVHpo; _ga=GA1.2.1108268304.1586306810; _gid=GA1.2.834212331.1586308185",
  };

  var dataString =
    "token=" +
    uuid() +
    "&username=" +
    encodeURIComponent(email) +
    "&password=" +
    encodeURIComponent(password);

  var options = {
    url: "https://my.freenom.com/dologin.php",
    method: "POST",
    headers: headers,
    body: dataString,
  };

  function callback(error, response, body) {
    //console.log(response["headers"]["set-cookie"][0]);
    cookiekey = response["headers"]["set-cookie"][0];
    return checkRenewStatus(process.argv[4]);
  }

  request(options, callback);
}
function checkRenewStatus(domainid) {
  var headers = {
    Referer:
      "https://my.freenom.com/domains.php?a=renewdomain&domain=" + domainid,
    Connection: "keep-alive",
    Host: "my.freenom.com",
    "Content-Length": "88",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Content-Type": "application/x-www-form-urlencoded",
    Origin: "https://my.freenom.com",
    "Accept-Language": "en-us",
    Cookie:
      cookiekey +
      "__utma=76711234.1108268304.1586306810.1586306810.1586306810.1; __utmb=76711234.39.10.1586306810; __utmc=76711234; __utmz=76711234.1586306810.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga=GA1.2.1108268304.1586306810; _gid=GA1.2.834212331.1586308185; __utmt=1; WHMCSZH5eHTGhfvzP=nnqrbo4lfhv0mc9eus9vlpco41; G_ENABLED_IDPS=google; dottyLn=en; mydottk_languagenr=0; wwwLn=en; __zlcmid=xcj2mdhKwtVHpo",
  };

  var dataString =
    "token=" + uuid() + "&renewalid=" + domainid + "&paymentmethod=credit";

  var options = {
    url: "https://my.freenom.com/domains.php?a=renewdomain&domain=" + domainid,
    method: "POST",
    headers: headers,
    body: dataString,
  };

  function callback2(error, response, body) {
    if (!error && response.statusCode == 200) {
      if (
        Number(
          body
            .match(/(<span class="textgreen">[0-9]+ Days<\/span>)/g)[0]
            .match(/[0-9]+ Days/g)[0]
            .match(/[0-9]+/g)[0]
        ) -
          14 ==
        0
      ) {
        console.log("Success! Today's the day to renew!");
      } else {
        console.log(
          "Please wait " +
            (
              Number(
                body
                  .match(/(<span class="textgreen">[0-9]+ Days<\/span>)/g)[0]
                  .match(/[0-9]+ Days/g)[0]
                  .match(/[0-9]+/g)[0]
              ) - 14
            ).toString() +
            " Days"
        );
      }
      return logout();
    }
  }

  request(options, callback2);
}
function logout() {
  var headers = {
    Host: "my.freenom.com",
    Connection: "keep-alive",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15",
    "Accept-Language": "en-us",
    Cookie:
      cookiekey +
      "__utma=76711234.1108268304.1586306810.1586306810.1586306810.1; __utmb=76711234.40.10.1586306810; __utmc=76711234; __utmz=76711234.1586306810.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _ga=GA1.2.1108268304.1586306810; _gid=GA1.2.834212331.1586308185; G_ENABLED_IDPS=google; dottyLn=en; mydottk_languagenr=0; wwwLn=en; __zlcmid=xcj2mdhKwtVHpo",
  };

  var options = {
    url: "https://my.freenom.com/logout.php",
    headers: headers,
  };

  function callback3(error, response, body) {
    if (!error && response.statusCode == 200) {
      return console.log("Logged Out!");
    }
  }

  request(options, callback3);
}
login(process.argv[2], process.argv[3]);
