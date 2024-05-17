import {RefObject, useEffect} from "react";

function useClickOutside(ref: RefObject<HTMLElement>, handler: Function) {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            //如果被点击的元素处于div之内的话 那么则不执行handler
            if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
                return
            }
            handler(event)
        }
        document.addEventListener('click', listener)
        return () => {
            document.removeEventListener('click', listener)
        }
    }, [ref, handler])
}


export default useClickOutside