import { ReactNode, useState } from "react";
import { Button } from "../ui/button";

type Tab = {
    label: string;
    content: ReactNode;
};

type TabsProps = {
    tabs: Tab[];
};
export default function TabChange({ tabs }: TabsProps) {
    const [activateTab, setActivateTab] = useState(0);
    return (
        <div className="w-full">
            <div className="flex gap-2 bottom-1 mb-11 font-raleway border-b-2 ">
                {tabs.map((tab, index) => {
                    return (
                        <Button
                            key={index}
                            onClick={() => setActivateTab(index)}
                            className={`outline-none rounded-none bg-transparent shadow-none text-stone-700 hover:bg-transparent ${activateTab === index
                                    ? "text-stone-950 border-b-2 border-b-stone-950 font-bold"
                                    : ""
                                }`}                       >{tab.label}
                        </Button>
                    )
                })}
            </div>
            <div>{tabs[activateTab].content}</div>
        </div>
    );
}