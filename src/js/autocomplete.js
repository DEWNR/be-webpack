
// Start Autocomplete predictive search - This uses scripts compiled into app.js
// The plugin we are using - https://www.devbridge.com/sourcery/components/jquery-autocomplete/

var autocomplete_visible = false;

// Run javascript after DOM is initialized
 $(document).ready(function() {
    $('#outputcontent').hide();
 });

//clicked autocomplete to search input
$('.autocomplete-suggestion').on('click', function() {
    autocomplete_visible = true;
    //console.log($(this));
    var text = $(this).text();
    $('#site-search-text').attr('value', text);
});

//hide autocomplete when not selected
$('.npsa').on('click', function() {
    autocomplete_visible = false;
    if (( $('#site-search-text').is(":focus") ) || ( $('.autocomplete-suggestion').is(":focus"))) {
        autocomplete_visible = true;
    }
    if (autocomplete_visible != true) {
        $('#outputcontent').hide();
        $('#site-search-text').css({'border-bottom-left-radius': '10% 50%' });
    }
});

//show autocomplete when clicked
$('#site-search-text').on('click', function() {
    if (autocomplete_visible != true) {
        $('#site-search-text').css({'border-radius': 0 });
        $('#outputcontent').show();
        autocomplete_visible = true;
    }
});


$(document).ready(function() {
    $.getJSON('//www.environment.sa.gov.au/feed.rss?listname=Copy%20of%20npsa-autocomplete-TEST', function(data) {
        var aSuggestions = data;

        // setup autocomplete function pulling from aSuggestions[] array
        $('#site-search-text').autocomplete({  //search input in header
            lookup: aSuggestions,
            maxHeight: 300,
            onSelect: function (suggestion) {
              // doSearch('site-search-text');
              goPage('site-search-text');  //go directly to the page for this text
            }
        });

        $('.new__input').autocomplete({  //search input in page
            lookup: aSuggestions,
            maxHeight: 300,
            beforeRender: function (container, suggestions) {
                $(container).addClass('render');
            }
        });
    });
 });


function goPage(searchText) {
    console.log(searchText);
}
