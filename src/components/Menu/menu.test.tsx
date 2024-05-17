import React from 'react';
import {fireEvent, render, RenderResult, cleanup, waitFor} from "@testing-library/react";
import Menu, {MenuProps} from "./menu";
import MenuItem from "./menuItem";
import SubMenu from "./subMenu";

const testMenuProps: MenuProps = {
    defaultIndex: '0',
    onSelect: jest.fn(),
    className: 'test'
}
const testVerticalProps: MenuProps = {
    defaultIndex: '0',
    mode: 'vertical',
}

const generateMenu = (props: MenuProps) => {
    return (
        <Menu {...props}>
            <MenuItem>
                active
            </MenuItem>
            <MenuItem disabled>
                disabled
            </MenuItem>
            <MenuItem>
                xyz
            </MenuItem>
            <SubMenu title='dropdown'>
                <MenuItem>
                    drop1
                </MenuItem>
            </SubMenu>
        </Menu>
    )
}
//在该测试案例中  我们的HTML结构不会被外面的css渲染 所以我们要手动添加
const createStyleFile = () => {
    const cssFile: string = `
    .fish-submenu{
        display:none
    }    
    .fish-submenu.menu-opened {
         display: block;
    }
   `
    //参数为创建的标签的名称
    const style = document.createElement('style')
    style.innerHTML = cssFile
    return style
}
let wrapper: RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disabledElement: HTMLElement
describe('Menu&MenuItemComponent', function () {
    //这个函数在每一个it调用之前都会调用
    beforeEach(() => {
        //wrapper在这里是一个测试渲染的实例，它代表了组件在渲染后的虚拟DOM结构。
        wrapper = render(generateMenu(testMenuProps))
        //wrapper.container是包裹最外层结构的标签 一般是div（React自动添加）
        wrapper.container.append(createStyleFile())
        //这里的menuElement就是最外层li元素
        menuElement = wrapper.getByTestId('test-menu')
        activeElement = wrapper.getByText('active')
        disabledElement = wrapper.getByText('disabled')
    })

    it('should render correct Menu and MenuItem based on props', function () {
        expect(menuElement).toBeInTheDocument()
        // expect(menuElement.getElementsByTagName('li').length).toEqual(3)
        //:scope相当于是 sass中的&                       只收集ul的儿子li节点
        expect(menuElement.querySelectorAll(':scope>li').length).toEqual(4)
        expect(menuElement).toHaveClass('fish-menu test')
        expect(disabledElement).toHaveClass('is-disabled')
        expect(activeElement).toHaveClass('is-active')
    });
    it('click items should change active and call the right callback', function () {
        const thirdItem = wrapper.getByText('xyz')
        fireEvent.click(thirdItem)
        expect(thirdItem).toHaveClass('is-active')
        expect(activeElement).not.toHaveClass('is-active')
        //括号里是希望传递的参数
        expect(testMenuProps.onSelect).toHaveBeenCalledWith('2')
        fireEvent.click(disabledElement)
        expect(disabledElement).not.toHaveClass('is-active')
        expect(testMenuProps.onSelect).not.toHaveBeenCalledWith('1')
    });
    it('should render vertical mode when mode is set to vertical', function () {
        //cleanup() 用来清除 beforeEach对本次调用的影响
        cleanup()
        const wrapper = render(generateMenu(testVerticalProps))
        const verticalMenuElement = wrapper.getByTestId('test-menu')
        expect(verticalMenuElement).toHaveClass('menu-vertical')
    });
    it('should show dropdown items when hover on subMenu', async function () {
        // getByText()和queryByText的区别是 后者会返回none|HTMLElement  前者只会返回HTMLELement
        expect(wrapper.queryByText('drop1')).not.toBeVisible()
        const dropdownElement = wrapper.getByText('dropdown')
        expect(dropdownElement).toBeInTheDocument()
        fireEvent.mouseEnter(dropdownElement)
        //因为页面上的显示是异步的 所以这里也需要使用异步
        await waitFor(() => {
            expect(wrapper.queryByText('drop1')).toBeVisible()
        })
        fireEvent.click(wrapper.getByText('drop1'))
        expect(testMenuProps.onSelect).toHaveBeenCalledWith('3-0')
        fireEvent.mouseLeave(dropdownElement)
        await waitFor(() => {
            expect(wrapper.queryByText('drop1')).not.toBeVisible()
        })
    });
});