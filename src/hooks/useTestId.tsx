import { TestIdContext } from "@/contexts/TestIdContext"
import { useContext, useEffect } from "react"

const useTestId = () => {
    const context = useContext(TestIdContext)
    if (context === null) {
        throw new Error("useTestId must be used within an TestIdProvider")
    }
    const { ids, setIds } = context;

    useEffect(() => {
        const storedTestId = localStorage.getItem("testId");
        if (storedTestId) {
            setIds(JSON.parse(storedTestId));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("testId", JSON.stringify(ids));
    }, [ids]);

    return { ids, setIds };
};

export default useTestId;