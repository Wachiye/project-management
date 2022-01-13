const TextToHTML = ({text}) =>{
    if(text){
        return <div className="text-body" dangerouslySetInnerHTML={{__html:text}} />;
    } else{
        return null;
    }
}

export default TextToHTML;