import './App.css'

import {useReducer, useState, useEffect, useCallback} from "react"
import {Divider} from "antd"
import axios from "axios"

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search'

const STORY_ACTIONS = {
    FIRST_FETCH: 'FIRST_FETCH',
    STORIES_FETCH_INIT: 'STORIES_FETCH_INIT',
    STORIES_FETCH_SUCCESS: 'STORIES_FETCH_SUCCESS',
    STORES_FETCH_FAILURE: 'STORES_FETCH_FAILURE',
    SET_STORIES: 'SET_STORIES',
    REMOVE_STORY: 'REMOVE_STORY',
}

const Item = ({key, item, onRemoveStory}) => {
    return (
        <li key={key}>
            <span><a href={item.url}>{item.title}</a></span>
            <span>{`${item.author}`}</span>
            <span>{item.num_comments} comments</span>
            <span>{item.points} points</span>
            <button onClick={() => {
                onRemoveStory(item)
            }}>Dismiss
            </button>
        </li>
    )
}

const List = ({stories, onRemoveStory}) => {
    return (
        <ul key="stories">
            {stories.map((item) => {
                return (
                    <Item key={item.objectID} item={item} onRemoveStory={onRemoveStory}/>
                )
            })}
        </ul>
    );
}

const InputWithLabel = ({id, type = "text", value, isFocused, onKeyDown, onInputChange, children}) => {
    return (
        <>
            <label htmlFor="search">{children}</label>
            <input id={id} type={type} onChange={onInputChange} autoFocus={isFocused} onKeyDown={onKeyDown} value={value}/>
        </>
    );
}

const useLogMessage = () => {
    const [msg, setMsg] = useState('--blank message--')
    useEffect(() => {
        console.log(msg)
    }, [msg])
    return [msg, setMsg]
}

const useStorageState = (key, initialState) => {
    const [value, setValue] = useState(localStorage.getItem(key) ?? initialState)
    useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key])
    return [value, setValue]

}

const App = () => {
    const storiesReducer = (state, action) => {
        switch (action.type) {
            case STORY_ACTIONS.FIRST_FETCH:
                return {
                    ...state,
                    isFirstLoad: true,
                    isLoading: true,
                    isError: false,
                }
            case STORY_ACTIONS.STORIES_FETCH_INIT:
                return {
                    ...state,
                    isLoading: true,
                    isError: false,
                }
            case STORY_ACTIONS.STORIES_FETCH_SUCCESS:
                return {
                    ...state,
                    data: action.payload,
                    isFirstLoad: false,
                    isLoading: false,
                    isError: false,
                }
            case STORY_ACTIONS.STORES_FETCH_FAILURE:
                return {
                    ...state,
                    isFirstLoad: true,
                    isLoading: false,
                    isError: true,
                }
            case STORY_ACTIONS.REMOVE_STORY:
                return {
                    ...state,
                    data: state.data.filter((story) => {
                        return story.objectID !== action.payload.objectID
                    })
                }
            default:
                throw new Error()
        }
    }

    const [searchTerm, setSearchTerm] = useStorageState('search', 'React')
    const [searchUrl, setSearchUrl] = useState()
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
        if(event.type === 'keydown' && event.key === 'Enter') {
            setSearchUrl(`${API_ENDPOINT}?query=${searchTerm ? searchTerm : 'react'}`)
        }
    }

    const [stories, dispatchStories] = useReducer(storiesReducer, {data: [], isLoading: false, isError: false})

    // load the stories
    const handleFetchStories = useCallback(() => {
        if(stories && !stories.isFirstLoad) {
            dispatchStories({type: STORY_ACTIONS.STORIES_FETCH_INIT})
        } else {
            dispatchStories({type: STORY_ACTIONS.FIRST_FETCH})
        }

        axios
            .get(searchUrl)
            .then(result => {
                dispatchStories({
                    type: STORY_ACTIONS.STORIES_FETCH_SUCCESS,
                    payload: result.data ? result.data.hits : [],
                })
            })
            .catch((err) => {
                console.error("error: ", err)
                dispatchStories({type: STORY_ACTIONS.STORES_FETCH_FAILURE})
            })
    }, [searchUrl])
    useEffect(() => {
        handleFetchStories()
    }, [handleFetchStories])

    const handleRemoveStory = (item) => {
        dispatchStories({type: STORY_ACTIONS.REMOVE_STORY, payload: item})
    }

    const [inputLogMessage, setInputLogMessage] = useState("--blank message--")
    const [logMessage, setLogMessage] = useLogMessage()
    const handleLogMessage = (event) => {
        console.log(event)
        setInputLogMessage(event.target.value)
        if(event.type === 'keydown' && event.key === 'Enter') {
            setLogMessage(event.target.value)
        }
    }

    return (
        <div>
            {stories.isError && <p>Something went wrong!</p>}
            {stories && stories.isLoading && stories.isFirstLoad ?
                (<p>Loading...</p>) :
                (
                    <>
                        <InputWithLabel id="search" isFocused onKeyDown={handleSearch} onInputChange={handleSearch} value={searchTerm}>
                            <strong>Search:</strong>
                        </InputWithLabel>
                        <InputWithLabel id="logMessage" onKeyDown={handleLogMessage} onInputChange={handleLogMessage} value={inputLogMessage}>
                            <strong>Message:</strong>
                        </InputWithLabel>
                        <em>Last Log Message: {logMessage}</em>
                        <Divider/>
                        <List stories={stories.data} onRemoveStory={handleRemoveStory}/>
                    </>
                )
            }
        </div>
    )
}
export default App
