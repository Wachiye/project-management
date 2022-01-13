import * as $ from "jquery";

const isLoading = (loading=true)=> {
    if(loading){
        $('body').prepend("<div class='loading'><div class='loader'><span class='fa fa-spinner mx-2'></span><div></div>");
    } else {
        $(".loading").remove();
    }
}

export default isLoading;