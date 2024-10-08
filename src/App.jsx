import * as React from 'react';

import {Divider, DatePicker, Button} from "antd";

import './App.css'
import {useState} from "react";

const Item = ({key, url, title, authors, num_comments, points}) => {

    return (
        <li key={key}>
            <span><a href={url}>{title}</a></span>
            <span>{`${authors}`}</span>
            <span>{num_comments} comments</span>
            <span>{points} points</span>
        </li>
    )
}

const List = (props) => {
    return (
        <ul>
            {props.list.map(({object_id, ...item}) => {
                return (
                    <Item key={object_id} {...item} />
                )
            })}
        </ul>
    );
}

const InputWithLabel = ({id, type = "text", value, isFocused, onInputChange, children}) => {

    return (
        <>
            <label htmlFor="search">{children}</label>
            <input id={id} type={type} onChange={onInputChange} autoFocus={isFocused} value={value}/>
        </>
    );
}

const App = () => {
    const list = [
        {
            title: 'React',
            url: 'https://reactjs.org',
            authors: ['Jordan Walker'],
            num_comments: 3,
            points: 4,
            object_id: 0,
        },
        {
            title: 'Redux',
            url: 'https://redux.js.org',
            authors: ['Dan Abramov', 'Andrew Clark'],
            num_comments: 2,
            points: 5,
            object_id: 1,
        },
    ]


    const [logMessage, setLogMessage] = useLogMessage()
    const handleLogMessage = (event) => { setLogMessage(event.target.value) }

    const [searchTerm, setSearchTerm] = useStorageState('search','React')
    const handleSearch = (event) => {
        console.log(event.target.value)
        setSearchTerm(event.target.value)
    }

    const searchedStories = list.filter((s) => {
        return s.title.toLowerCase().includes(searchTerm.toLowerCase())
    })
    return (
        <div>
            <InputWithLabel id="search" isFocused onInputChange={handleSearch} search={searchTerm}><strong>Search:</strong></InputWithLabel>
            <InputWithLabel id="logMessage" type="url" onInputChange={handleLogMessage} search={logMessage}><strong>Message:</strong></InputWithLabel>
            <hr/>
            <List list={searchedStories} />
            <Divider/>
            <Button variant={"text"} iconPosition={"end"} loading={true}>Test</Button>
            <Divider/>
            <DatePicker/>
        </div>
    );
}

const useLogMessage = () => {
    const[msg, setMsg] = useState('--blank message--')
    React.useEffect(() => { console.log(msg)}, [msg])
    return [msg, setMsg]
}

const useStorageState = (key, initialState) => {
    const [value, setValue] = useState(localStorage.getItem(key) ?? initialState)
    React.useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key])
    return [value, setValue]

}

export default App
