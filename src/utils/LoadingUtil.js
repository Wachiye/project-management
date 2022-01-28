import * as $ from "jquery";

const isLoading = (loading=true)=> {
    if(loading){
        $('body').prepend("<div class='loading'><div class='loader'>Loading<div></div>");
    } else {
        $(".loading").remove();
    }
}

export default isLoading;