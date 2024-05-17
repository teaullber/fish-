import React, {ChangeEvent, ReactElement, ReactNode, KeyboardEvent, useEffect, useState, useRef} from 'react';
import Input, {InputProps} from "../Input/input";
import Icon from "../Icon/icon";
import useDebounce from "../../hooks/useDebounce";
import classNames from "classnames";
import useClickOutside from "../../hooks/useClickOutside";

//用来规定数据源的数据类型
interface DataSourceObject {
    value: string;
}

//泛型
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    //检索信息的方式
    fetchSuggestions: (str: string) => Array<DataSourceType> | Promise<DataSourceType[]>
    //用户选择之后的回调函数
    onSelect?: (item: DataSourceType) => void,
    //支持用户自定义列表
    renderOption?: (item: DataSourceType) => ReactNode
}

const AutoComplete = (props: AutoCompleteProps) => {
    const {
        fetchSuggestions,
        onSelect,
        //这个value是input框的value
        value,
        renderOption,
        ...restProps
    } = props
    //输入框的value值
    const [inputValue, setInputValue] = useState<string>(value as string);
    //搜索结果
    const [suggestions, setSuggestions] = useState<DataSourceType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [highLightIndex, setHighLightIndex] = useState<number>(-1);
    const triggerSearch = useRef<boolean>(false);
    //防抖的value 在输入后500毫秒内 如果没有新的输入的话 才会更新debouncedValue为inputValue
    const debouncedValue = useDebounce(inputValue, 500)
    const componentRef = useRef<HTMLDivElement>(null)
    useClickOutside(componentRef, () => { setSuggestions([])})
    useEffect(() => {
        if (debouncedValue&&triggerSearch.current) {
            const results = fetchSuggestions(debouncedValue)
            if (results instanceof Promise) {
                console.log('trigger')
                setLoading(true)
                results.then(data => {
                    setSuggestions(data)
                    setLoading(false)
                })
            } else {
                setSuggestions(results)
            }
        } else {
            setSuggestions([])
        }
        setHighLightIndex(-1)
    }, [debouncedValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setInputValue(value)
        triggerSearch.current=true
    }
    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setSuggestions([])
        if (onSelect) {
            onSelect(item)
        }
        triggerSearch.current=false
    }
    const highLight = (index: number) => {
        if (index < 0) index = 0
        if (index >= suggestions.length) index = suggestions.length - 1
        setHighLightIndex(index)
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.keyCode) {
            //回车
            case 13:
                if(suggestions[highLightIndex])
                handleSelect(suggestions[highLightIndex])
                break
            //向上
            case 38:
                highLight(highLightIndex - 1)
                break
            //向下
            case 40:
                highLight(highLightIndex + 1)
                break
            //ESC
            case 27:
                setSuggestions([])
                break
            default:
                break
        }
    }

    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }
    const generateDropdown = () => {
        return (
            <ul>
                {suggestions.map((item, index) => {
                        const cnames = classNames('suggestion-item', {
                            'item-highlighted': index === highLightIndex
                        })
                        return (
                            <li key={index} onClick={() => handleSelect(item)} className={cnames}>
                                {renderTemplate(item)}
                            </li>
                        )
                    }
                )}
            </ul>
        )
    }
    return (
        <div className='fish-auto-complete' ref={componentRef}>
            <Input
                value={inputValue}
                onChange={handleChange}
                {...restProps}
                style={{width: '200px'}}
                onKeyDown={handleKeyDown}
            >
            </Input>
            {loading && <ul><Icon icon='spinner' spin></Icon></ul>}
            {suggestions.length > 0 && generateDropdown()}
        </div>
    );
};

export default AutoComplete;
  