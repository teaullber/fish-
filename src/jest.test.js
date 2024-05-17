// create-react-app已经内置了jest测试框架
test('test common matcher',()=>{
    expect(2+2).toBe(4)
    expect(2+2).not.toBe(5)
})

test('test to be true or false',()=>{
    expect(1).toBeTruthy()
    expect(0).toBeFalsy()
})

test('test number',()=>{
    //希望4比3大
    expect(4).toBeGreaterThan(3)
    expect(2).toBeLessThan(3)
})

test('test object',()=>{
    //toBe是完全相同  要测试值是否相同要用toEqual
    expect({name:'why'}).toEqual({name:'why'})
})
