import React, {ChangeEvent} from 'react';
import Button, {ButtonSize, ButtonType} from "./components/Button/button";
import Menu from "./components/Menu/menu";
import MenuItem from "./components/Menu/menuItem";
import SubMenu from "./components/Menu/subMenu";
import Icon from "./components/Icon/icon";
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import Input from "./components/Input/input";
import AutoComplete, {DataSourceType} from "./components/AutoComplete/autoComplete";
import {upload} from "@testing-library/user-event/dist/upload";
import axios from "axios";
import Upload, {UploadFile} from "./components/Upload/upload";

library.add(fas)
interface lakerPlayerProps{
    number:number
}
interface GithubUserProps {
    login: string;
    url: string;
    avatar_url: string;
}
const handlerFileChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const files=e.target.files
    if(files){
        //下载的文件信息
        const uploadFile=files[0]
        console.log(uploadFile);
        //使用new关键字模拟创造表单数据
        const formData=new FormData()
        //append()方法需要两个参数：一个是字段的名称，另一个是该字段的值。
        formData.append(uploadFile.name,uploadFile)
        axios.post('https://jsonplaceholder.typicode.com/posts',formData,{
            headers:{
                "Content-Type":'multipart/form-data'
            }
        }).then(res=>{
            console.log(res);
        })
    }
}
// const checkSize=(file:File)=>{
    // if(Math.round(file.size/1024)>50){
    //     alert(`${file.name}———file too big`)
    //     return false
    // }
    // return true
    // return Promise.resolve(file)
// }
const defaultFileList:UploadFile[]=[
    {uid:'123',size:1234,name:"hello.md",status:'uploading',percent:20},
    {uid:'124',size:1234,name:"xyz.md",status:'success',percent:20},
    {uid:'125',size:1234,name:"test.md",status:'error',percent:20}
]

function App() {
    // const lakersWithNumber = [
    //     {value: 'bradley', number: 11},
    //     {value: 'pope', number: 1},
    //     {value: 'caruso', number: 4},
    //     {value: 'cook', number: 2},
    //     {value: 'cousins', number: 15},
    //     {value: 'james', number: 23},
    //     {value: 'AD', number: 3},
    //     {value: 'green', number: 14},
    //     {value: 'howard', number: 39},
    //     {value: 'kuzma', number: 0},
    // ]
    // const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins',
    //     'james', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando']
    // const handleFetch=(query:string)=>{
    //     return fetch(`https://api.github.com/search/users?q=${query}`)
    //         .then(res=>res.json()
    //             .then(({items})=>{
    //                 console.log(items)
    //                 return items.slice(0,10).map((item:any) =>({value:item.login,...item}))
    //             })
    //     )
    // }
    return (
        <div className="App">
            <Upload action='https://jsonplaceholder.typicode.com/posts'
                    // onError={(res,file)=> console.log(res,file)}
                    // onSuccess={(res,file)=> console.log(res,file)}
                    // onProgress={(percentage, file)=> console.log(percentage,file)}
                    // onChange={(file)=> console.log(file,'change')}
                    // beforeUpload={checkSize}
                    defaultFileList={defaultFileList}
                    onRemove={(item)=> console.log(item)}
            ></Upload>
            {/*测试文件上传*/}
            {/*<input type="file" name='myFile' onChange={handlerFileChange}/>*/}


            {/*<AutoComplete*/}
            {/*    onSelect={(item) => console.log(item)}*/}
            {/*    fetchSuggestions={(item) =>handleFetch(item)}*/}
            {/*    renderOption={(item:DataSourceType)=>{*/}
            {/*        //使用泛型 动态决定数据类型*/}
            {/*        const itemWith=item as DataSourceType<GithubUserProps>*/}
            {/*        return(*/}
            {/*            <div>*/}
            {/*                <h2>Name:{itemWith.value}</h2>*/}
            {/*                <p>url:{itemWith.url}</p>*/}
            {/*            </div>*/}
            {/*        )*/}
            {/*    }}*/}
            {/*>*/}
            {/*</AutoComplete>*/}
            {/*<Input></Input>*/}
            {/*<Icon icon='arrow-alt-circle-left' size='10x' theme='danger' beat></Icon>*/}
            {/*/!*<FontAwesomeIcon icon={faEnvelope} size={'10x'} ></FontAwesomeIcon>*!/*/}
            {/*<Menu  mode={"horizontal"} defaultIndex={'0'} onSelect={(index) => console.log(index)}>*/}
            {/*    <MenuItem>*/}
            {/*        橘子3333333*/}
            {/*    </MenuItem>*/}
            {/*    <MenuItem>*/}
            {/*        樱桃3333333*/}
            {/*    </MenuItem>*/}
            {/*    <SubMenu title='dropdown'>*/}
            {/*        <MenuItem>*/}
            {/*            drop1*/}
            {/*        </MenuItem>*/}
            {/*    </SubMenu>*/}
            {/*</Menu>*/}
            <Button btnType={ButtonType.Primary} size={ButtonSize.Large} disabled>测试</Button>
            <Button btnType={ButtonType.Link} href='http://www.4399.com'>测试</Button>
            <Button onClick={() => console.log(123)} btnType={ButtonType.Default}
                    size={ButtonSize.Large}>large</Button>
            <Button btnType={ButtonType.Default} size={ButtonSize.Small}>Small</Button>
            <Button btnType={ButtonType.Danger} size={ButtonSize.Small}>Danger</Button>
        </div>
    );
}

export default App;
