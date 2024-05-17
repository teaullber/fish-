import React from 'react';
import {fireEvent, render} from "@testing-library/react";
import Button, {ButtonProps, ButtonSize, ButtonType} from "./button";

const defaultProps={
    // jest框架提供的模拟函数
    onClick:jest.fn()
}
const testProps:ButtonProps={
    size:ButtonSize.Large,
    btnType:ButtonType.Primary,
    className:'test'
}
const LinkProps:ButtonProps={
    href:'http://www.4399.com',
    btnType:ButtonType.Link
}
const disabledProps:ButtonProps={
    disabled:true,
    onClick:jest.fn()
}
describe('Button Component', function () {
    it('shoule render the correct default button',()=>{
        const wrapper=render(<Button {...defaultProps}>Nice</Button>)
        const element=wrapper.getByText('Nice') as HTMLButtonElement
        //希望element元素在Dom里
        expect(element).toBeInTheDocument()
        expect(element.tagName).toEqual('BUTTON')
        expect(element).toHaveClass('btn btn-default')
        expect(element.disabled).toBeFalsy()
        //进行点击事件
        fireEvent.click(element)
        //希望onClick事件被调用过了
        expect(defaultProps.onClick).toHaveBeenCalled()
    })
    it('should render the correct based on different props', function () {
        const wrapper=render(<Button {...testProps}>Nice</Button>)
        const element=wrapper.getByText('Nice')
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('btn-primary btn-lg test')
    });
    it('should render a link when btnType equals link and href is provided', function () {
        const wrapper=render(<Button {...LinkProps}>Nice</Button>)
        const element=wrapper.getByText('Nice')
        expect(element).toBeInTheDocument()
        expect(element.tagName).toEqual('A')
        expect(element).toHaveClass('btn btn-link')
    });
    it('should render disabled button when disabled set to be true', function () {
        const wrapper=render(<Button {...disabledProps}>Nice</Button>)
        const element=wrapper.getByText('Nice') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element.disabled).toBeTruthy()
        fireEvent.click(element)
        expect(disabledProps.onClick).not.toHaveBeenCalled()
    });
});

