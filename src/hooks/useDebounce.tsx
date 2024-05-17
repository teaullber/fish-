import React, {useEffect, useState} from 'react';

const useDebounce = (value:any,delay:number=300) => {
    const [debouncevalue, setDebouncevalue] = useState(value);
    useEffect(() => {
        const handler=setTimeout(()=>{
            setDebouncevalue(value)
        },delay)
        return()=>{
            clearTimeout(handler)
        }
    }, [value,delay]);
    return debouncevalue
};

export default useDebounce;
