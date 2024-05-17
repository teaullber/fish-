import React, {
    useContext,
    FunctionComponentElement,
    ReactNode,
    Children,
    useState,
    MouseEvent,
    cloneElement
} from 'react';
import classNames from 'classnames'
import {MenuContext} from "./menu";
import {MenuItemProps} from "./menuItem";
import Icon from "../Icon/icon";
import Transition from "../Transtion/transiton";

export interface SubMenuProps {
    index?: string,
    title: string,
    className?: string,
    children: ReactNode
}

const SubMenu: React.FC<SubMenuProps> = ({index, title, className, children}) => {
    const context = useContext(MenuContext);
    const opendedSubMenus = context.defaultOpenSubMenus as Array<string>
    const isOpen = !!(index && context.mode === 'vertical' && opendedSubMenus.includes(index))
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const handleClick = () => {
        setMenuOpen(!menuOpen)
    }
    let timer: any
    const handleHover = (e: MouseEvent, toggle: boolean) => {
        clearTimeout(timer)
        //延迟0.3秒之后再去打开菜单栏
        timer = setTimeout(() => {
            setMenuOpen(toggle)
        }, 300)
    }
    const clickEvents = context.mode === 'vertical' ? {onClick: handleClick} : {}
    const hoverEvents = context.mode === 'horizontal' ? {
        onMouseEnter: (e: MouseEvent) => handleHover(e, true),
        onMouseLeave: (e: MouseEvent) => handleHover(e, false)
    } : {}
    const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.index === index,
        'is-opened': menuOpen,
        'is-vertical': context.mode === 'vertical'
    })
    const renderChildren = () => {
        const classes = classNames('fish-submenu',
            {'menu-opened': isOpen || menuOpen})
        const childComponent = Children.map(children, (item, i) => {
            const childElement = item as FunctionComponentElement<MenuItemProps>
            const {displayName} = childElement.type
            if (displayName === 'MenuItem') {
                return cloneElement(childElement, {
                    index: `${index}-${i}`
                })
            } else {
                console.error('Warning:Menu has a child which is not a MenuItem Component')
            }
        })
        return (
            <Transition
                //in接收动画触发的状态，为 true 时触发 进入动画，为 false 时触发 离开动画
                in={menuOpen}
                //timeout为动画的持续时间
                timeout={300}
                animationname={'zoom-in-top'}
                //控制组件在出现的时候 是否会有动画
                // appear
                //设置了这个属性之后 当动画exit-down后，节点会被卸载掉
                // unmountOnExit={true}
            >
                <ul className={classes}>
                    {childComponent}
                </ul>
            </Transition>
        )
    }
    return (
        <li className={classes} key={index} {...hoverEvents}>
            <div className='submenu-title' {...clickEvents}>{title}
                <Icon icon='angle-down' className='arrow-icon'></Icon>
            </div>
            {renderChildren()}
        </li>
    );
};
SubMenu.displayName = 'SubMenu'
export default SubMenu;
