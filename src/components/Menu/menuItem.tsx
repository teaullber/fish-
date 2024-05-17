import React, {ReactNode,useContext} from 'react';
import classNames from 'classnames'
import {MenuContext} from "./menu";
export interface MenuItemProps{
    index?:string
    disabled?:boolean
    className?:string
    style?:React.CSSProperties
    children:ReactNode
}
const MenuItem = (props:MenuItemProps) => {
    const context=useContext(MenuContext)
    const {
        index,
        disabled,
        className,
        style,
        children
    }=props

    const classes=classNames('menu-item',
        {'is-disabled':disabled},
        {'is-active':context.index===index}
    )
    const handleClick=()=>{
        if(context.onSelect&&!disabled&&(typeof index=='string')){
            context.onSelect(index)
        }
    }
    return (
    <li className={classes} style={style} onClick={handleClick}>
        {children}
    </li>
    );
};

MenuItem.defaultProps={
    disabled:false
}
//用来标识children 在父组件中便于寻找
MenuItem.displayName='MenuItem'
export default MenuItem;
