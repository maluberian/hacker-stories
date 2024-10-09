import * as React from 'react';

import './App.css'
import {useState} from "react";

const initCount = () => {
    return 0
}

const Button = () => {
    console.log("Button render.")

    let [clickCount, setClickCount] = useState(initCount);
    return <button onClick={() => setClickCount(clickCount+1)}>Hello {clickCount}</button>
}

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
    console.log("List render.")
    return (
        <ul>
            {props.list.map(({object_id, ...item}) => {
                console.log(<Item key={object_id} {...item} />);
                return (
                    <Item key={object_id} {...item} />
                )
            })}
        </ul>
    );
}

const Search = ({onSearch, search}) => {
    console.log("Search render.")

    const handleBlur = (event) => {
        console.log(event.type, event.target.value, event)
    }

    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" onChange={onSearch} onBlur={handleBlur} value={search}/>
        </div>
    );
}

const App = () => {
    console.log("App render.")

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

    const [searchTerm, setSearchTerm] = useState(localStorage.getItem('react:searchTerm') ?? 'React')

    React.useEffect(() => { localStorage.setItem('react:searchTerm', searchTerm) }, [ searchTerm])
    const handleSearch = (event) => {
        console.log(event.target.value)
        setSearchTerm(event.target.value)
    }

    const searchedStories = list.filter((s) => {
        return s.title.toLowerCase().includes(searchTerm.toLowerCase())
    })
    return (
        <div>
            <Search onSearch={handleSearch} search={searchTerm}/>
            <hr/>
            <List list={searchedStories} />
            <Button/>
            <Button/>
            <Button/>
            <Button/>
        </div>
    );
}

export default App
