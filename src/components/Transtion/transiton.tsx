import React, {FC} from 'react';
import {CSSTransition,} from "react-transition-group";
import {CSSTransitionProps} from "react-transition-group/CSSTransition";
type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right';
type TransitionProps = CSSTransitionProps & {
  animationname?:AnimationName
}
const Transition:FC<TransitionProps> = (props) => {
    const {
        children,
        animationname,
        classNames,
        ...restProps
    }=props
    return (
        <CSSTransition
            {...restProps}
            classNames={classNames?classNames:animationname}
        >
            {children}
        </CSSTransition>
    );
};
Transition.defaultProps={
    unmountOnExit:true,
    appear:true
}
export default Transition;
