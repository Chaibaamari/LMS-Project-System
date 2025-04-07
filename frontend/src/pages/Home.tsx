// export default function Home() {
//     return (
//         <>
//             <h1 className="text-center">Home</h1>
//             <p className='text-stone-400 text-center'>Welcome to the Home page</p>
//         </>
//     );
// }

import Role from "../components/Role";
import {Formation}  from "../components/Formation";
import {Tabs, Tab, Card, CardBody} from "@heroui/react";
import PrévisionsTotal from "../components/PrévisionsTotal";
import Prévisions from "../components/Prévisions";



export default function Home() {
    const tabs = [
        {
            id: "total",
            label: "Les Statistiques Générales",
            content: [
                <Role />,
                <br />,
                <PrévisionsTotal />
            ]
        },
        {
            id: "prévision",
            label: "Les Statistiques Des Prévisions",
            content: 
                <Prévisions />
        },
        {
            id: "formation",
            label: "Les Statistiques Des Formations",
            content: 
                <Formation />
        },
    ];
    
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Dynamic tabs" items={tabs} color="secondary" radius="full">
                {(item) => (
                    <Tab key={item.id} title={item.label}>
                        <Card>
                            <CardBody>{item.content}</CardBody>
                        </Card>
                    </Tab>
                )}
            </Tabs>
        </div>
    );
}