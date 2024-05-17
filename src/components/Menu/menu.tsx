import React, {
    ReactNode,
    createContext,
    useState,
    Children,
    FunctionComponentElement,
    cloneElement
} from 'react';
import classNames from 'classnames'
import {MenuItemProps} from "./menuItem";
import {stringify} from "querystring";

type MenuMode = 'horizontal' | 'vertical'
type SelectCB = (selectIndex: string) => void

export interface MenuProps {
    //默认高亮的菜单
    defaultIndex?: string,
    className?: string
    //排列方向
    mode?: MenuMode,
    //用户传来的样式
    style?: React.CSSProperties,
    //点击的回调函数
    onSelect?: SelectCB,
    children?: ReactNode,
    defaultOpenSubMenus?:string[]
}

//父组件传递的context参数类型
interface IMenuContext {
    index: string,
    onSelect?: SelectCB,
    mode?:MenuMode,
    defaultOpenSubMenus?:string[]
}
export const MenuContext = createContext<IMenuContext>({index: '0'})
const Menu = (props: MenuProps) => {
    const {
        defaultIndex,
        className,
        mode,
        style,
        onSelect,
        children,
        defaultOpenSubMenus
    } = props
    const renderChildren=()=>{
        //第一个参数是Menu的children 第二个参数是回调函数
        return Children.map(children,(item,index)=>{
            //FunctionComponentElement 是函数式组件的元素节点 后面传的是他的props类型
            const childElement=item as FunctionComponentElement<MenuItemProps>
            const {displayName}=childElement.type
            if(displayName==='MenuItem'||displayName==='SubMenu'){
                //这样用户便不需要自己手动传入index
                return cloneElement(childElement,{index:index+''})
            }else{
                console.error('Warning:Menu has a child which is not a MenuItem Component')
            }
        })
    }
    const [currentActive, setCurrentActive] = useState<string>(defaultIndex?defaultIndex:'0');
    const classes = classNames('fish-menu', className, {
        'menu-vertical': mode === 'vertical',
        'menu-horizontal': mode !== 'vertical',
    })
    const handleClick = (index: string) => {
        setCurrentActive(index)
        //如果传递过来了onSelect函数,那么就执行
        if (onSelect) {
            onSelect(index)
        }
    }
    const passedContext: IMenuContext = {
        index: currentActive ? currentActive : '0',
        //不要把这里的onSelect与props中的onSelect搞混
        onSelect: handleClick,
        mode:mode,
        defaultOpenSubMenus:defaultOpenSubMenus
    }
    return (
        // 这个data-testid用来在进行组件测试的时候获取menu组件
        <ul className={classes} style={style} data-testid="test-menu">
            {/*父元素向多个子元素传递信息 所以选用context状态树来传递信息*/}
            <MenuContext.Provider value={passedContext}>
                {renderChildren()}
            </MenuContext.Provider>
        </ul>
    );
}
Menu.defaultProps = {
    defaultIndex: '0',
    mode: 'horizontal',
    defaultOpenSubMenus:[]
}

export default Menu;
