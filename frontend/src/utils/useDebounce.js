import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {

    const [debounceValue, setDebounceValue] = useState();

    useEffect(() => {

        const timeOutId = setTimeout(() => {
            setDebounceValue(value)
        }, delay)

        return () => clearTimeout(timeOutId);

    }, [value, delay])

    return debounceValue

}

export default useDebounce;