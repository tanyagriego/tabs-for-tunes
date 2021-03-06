const YouTube_Search_URL = "https://www.googleapis.com/youtube/v3/search";
const StackOverflow_Search_URL = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow";
const YOUTUBE_KEY = "AIzaSyBXjnIeLhAmsGhwe7XQePKmHvCL1J_DEMM";

$('.search-results').hide();

//This function gets data from the StackOverFlow API
function getStackOverFlowData (searchTerm, callback){
    const settings = {
        url: StackOverflow_Search_URL,
        data: {
            intitle: `javascript ${searchTerm}`,
        },

        dataType: 'json',
        type: "GET",
        success: callback
    };
    $.ajax(settings);
}

//This function gets data from the YouTube API
function getYouTubeData (searchTerm, callback){
    const settings = {
        url: YouTube_Search_URL,
        data: {
            q: `javascript ${searchTerm}`,
            part: 'snippet',
            key: YOUTUBE_KEY,
            maxResults  : 10,

        },
        dataType: 'json',
        type: "GET",
        success: callback
    };
    $.ajax(settings);
}

//This function appends the YouTube API data to the DOM
function appendYouTubeApiData (item) {
    return `<div class="youTube-results"><a href="https://www.youtube.com/watch?v=${item.id.videoId} target="_blank"><img src="${item.snippet.thumbnails.default.url}"></a>
           <a href="https://www.youtube.com/watch?v=${item.id.videoId}" class="videoTitle" target="_blank">${item.snippet.title}</a></div>`;
}

//This function appends the StackOverflow API data to the DOM
function appendStackOverflowData (item) {
    return `<div class="stackOverflow-results"><a href="${item.link}" target= "_blank" class="stackOverflow-answer">${item.title}</a></div>`;
}

//This function displays YouTube data
function displayApiData (data) {
    console.log("YouTube Data " + data.items[0]);
    const results = data.items.map((item) => { 
        return appendYouTubeApiData (item);
    });

    if (results.length) {
        $('.youTube_search_results').html(results);
    } else {
        const noResults =  $(`<div class="no-results">404</div>`);
        $('.youTube_search_results').html(noResults);
    }
    $('.search-results').show();
}

//This function displays StackOverflow data
function displayStackOverflowData (data) {
    console.log("StackOverflow:" + data);
    const results = data.items.map((item) => { 
        return appendStackOverflowData (item);
    });

    if (results.length) {
        $('.stackOverflow_seach_results').html(results);
    } else {
        const noResults = $(`<div class="no-results">Sorry, there were no results for you search. Please try again. </div>`);
        $('.stackOverflow_seach_results').html(noResults);
    }
    $('.search-results').show();
    $('html,body').animate({
        scrollTop: $(".search-results").offset().top
    }, 2000);
}

//This function allows the user to submit their search results
function submit () {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const searchTermTextbox = $(event.currentTarget).find('.js-query');
        const query = searchTermTextbox.val();
        searchTermTextbox.val("").blur();
        getYouTubeData(query, displayApiData);
        getStackOverFlowData(query, displayStackOverflowData);
    });
}

$(submit);