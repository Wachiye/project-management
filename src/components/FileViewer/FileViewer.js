import DocViewer,{DocViewerRenderers} from "react-doc-viewer";
import FileViewer from 'react-file-viewer';

const MyDocViewer = ({file}) => {
    const docs = [
        {url: file?.fileURL},
    ];

    return (
        <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
    );
}
const MyFileViewer = ({file}) =>{
    let splitURL = file?.fileURL?.split(".");

    let type = splitURL ? splitURL[splitURL?.length -1] :  'auto';
    return(
        <FileViewer
        fileType={type}
        filePath={file?.fileURL} />
    );
}
export {MyDocViewer, MyFileViewer};