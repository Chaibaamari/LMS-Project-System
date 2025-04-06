const CurrentMonth = () => {
    const currentMonth = new Date().toLocaleString("default", { month: "long" });

    return <h2>Current Month: {currentMonth}</h2>;
};

export default CurrentMonth;

