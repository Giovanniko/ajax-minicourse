
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
  
    var streetstr = $('#street').val();
    var citystr = $('#city').val()
    var address = streetstr + ", "  + citystr;

    $greeting.text('So, you want to live at ' + address + '?');//replaces text in the element with greeting id

    var linkurl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    
    $body.append('<img class="bgimg" src="' + linkurl + '">');//end of first quiz

    //retrieve articles

    var key = '9475344af55141479886d89e9895ae84';
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "9475344af55141479886d89e9895ae84",
      'q': address,
      'sort': "newest"
    });
   
   $.getJSON( url, function( data ) {
      $nytHeaderElem.text('New York Times Articles About: ' + address);
      var values = [];

      $.each(data.response.docs, function(key, val) {
          values.push(val);//pushes each article's object into a new array to be broken apart
          //console.log(val.web_url, val.snippet, val.headline.main);
      });

       //select values from each article
      var items = [];
      $.each(values, function(key, val) {
        items.push("<li class='article'><a href='" + val.web_url + "'>'"+ val.headline.main + "'</a><p>'"+val.snippet+"'</p></li>");
      //console.log(items);
      });

//       for ( var i = 0; i < values.length; i++) {
//           var article = values[i];
//           $nytElem.append("<li class='article'><a href='" 
//           + val.web_url + "'>'"+ val.headline.main + "'</a><p>'"+val.snippet+"'</p></li>");
//       }
           
      $( "<ul/>", {
        "class": "article-list",
        html: items.join( "" )
      }).appendTo( "body" );
   }).fail(function() {
            $nytHeaderElem.text( "No NYT articles on this address!" );
        });
    
    //wikipedia query
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + citystr + '&format=json&callback=wikiCallback';

    console.log(wikiURL);
    $.ajax({
        url:wikiURL,
        dataType: "jsonp",
        success: function (response) {
            var articleList = response[1];

            for ( var i = 0; i < articleList.length; i++) {
                  var wikiArticle = response[i];
                  var linkURL = "http://en.wikikpedia.org/wiki/" + wikiArticle;
                  $wikiElem.append('<li><a href="'+ linkURL +'">'+ wikiArticle +'</a></li>');
            };

        }
    });
    return false;
};

$('#form-container').submit(loadData);