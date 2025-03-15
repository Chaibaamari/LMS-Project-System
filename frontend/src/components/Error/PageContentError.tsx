import { ReactNode } from "react";


const PageContentError: React.FC<{ title: string; children :ReactNode}>  = (props)=> {
    return (
        <div>
            <h1>{props.title}</h1>
            {props.children}
        </div>
    );
}

export default PageContentError;
