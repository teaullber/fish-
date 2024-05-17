import React, {ReactNode} from 'react';
import classNames from 'classnames'

//定义button的尺寸
export enum ButtonSize {
    Large = 'lg',
    Small = 'sm'
}

//定义button的类型
export enum ButtonType {
    Primary = 'primary',
    Default = 'default',
    Danger = 'danger',
    Link = 'link'
}

interface BaseButtonProps {
    className?: string,
    disabled?: boolean,
    size?: ButtonSize,
    btnType?: ButtonType,
    href?: string
}
//获取原生button和a上面的属性
type NativeButtonProps=BaseButtonProps&React.ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps=BaseButtonProps&React.AnchorHTMLAttributes<HTMLElement>
//Partial的作用是将所有属性变为可选的
export type ButtonProps=Partial<NativeButtonProps&AnchorButtonProps>
const Button = (props:ButtonProps) => {
    //解构属性
    const {
        className,
        disabled,
        size,
        btnType,
        href,
        children,
        ...restProps
    } = props
    //默认添加class属性btn
    const classes = classNames('btn',className, {
            [`btn-${btnType}`]: btnType,
            [`btn-${size}`]:size,
            //对于链接属性，因为其本身没有disabled属性，所以要手动添加
            'disabled':(btnType===ButtonType.Link)&&disabled
        },
    )
    if(btnType===ButtonType.Link&&href){
        return(
            <a {...restProps} className={classes} href={href}>{children}</a>
        )
    }else{
        return(
            <button {...restProps} className={classes} disabled={disabled}>{children}</button>
        )
    }
};
//在React中，可以通过设置组件的defaultProps属性来提供默认的props属性。
Button.defaultProps={
    disabled:false,
    btnType:ButtonType.Default
}
export default Button;
