import YearSelector from "@/components/YearSelector";

export default function Settings() {
    return (
        <>
            <h1 className="text-center">Settings</h1>
            <p className='text-stone-400 text-center'>Welcome to the Settings page</p>
            <center><YearSelector/></center>
        </>
    );
}