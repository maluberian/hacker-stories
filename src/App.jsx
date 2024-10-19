import {Divider} from "antd";

import './App.css'
import {useReducer, useState, useEffect, useCallback} from "react";

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
    console.log("list: ", stories)
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

const InputWithLabel = ({id, type = "text", value, isFocused, onInputChange, children}) => {
    console.log("input label: ", value)
    return (
        <>
            <label htmlFor="search">{children}</label>
            <input id={id} type={type} onChange={onInputChange} autoFocus={isFocused} value={value}/>
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
                console.log("remove: ", state, action)
                return {
                    ...state,
                    data: state.data.filter((story) => {
                        console.log("remove-filter: ", story.objectID, action.payload.objectID)
                        return story.objectID !== action.payload.objectID
                    })
                }
            default:
                throw new Error()
        }
    }

    const [searchTerm, setSearchTerm] = useStorageState('search', 'React')
    const handleSearch = (event) => {
        console.log(event.target.value)
        setSearchTerm(event.target.value)
    }

    const [stories, dispatchStories] = useReducer(storiesReducer, {data: [], isLoading: false, isError: false})

    // load the stories
    const handleFetchStories = useCallback(() => {

        if(stories && !stories.isFirstLoad) {
            dispatchStories({type: STORY_ACTIONS.STORIES_FETCH_INIT})
        } else {
            dispatchStories({type: STORY_ACTIONS.FIRST_FETCH})
        }

        fetch(`${API_ENDPOINT}?query=${searchTerm ? searchTerm : 'react'}`)
            .then(res => res.json())
            .then(json => {
                console.log("result: ", json)
                dispatchStories({
                    type: STORY_ACTIONS.STORIES_FETCH_SUCCESS,
                    payload: json.hits,
                })
            })
            .catch((err) => {
                console.error("error: ", err)
                dispatchStories({type: STORY_ACTIONS.STORES_FETCH_FAILURE})
            })
    }, [searchTerm])
    useEffect(() => {
        handleFetchStories()
    }, [handleFetchStories])

    const handleRemoveStory = (item) => {
        dispatchStories({type: STORY_ACTIONS.REMOVE_STORY, payload: item})
    }

    const [logMessage, setLogMessage] = useLogMessage()
    const handleLogMessage = (event) => {
        setLogMessage(event.target.value)
    }

    console.log("state: ", stories)
    return (
        <div>
            {stories.isError && <p>Something went wrong!</p>}
            {stories && stories.isLoading && stories.isFirstLoad ?
                (<p>Loading...</p>) :
                (
                    <>
                        <InputWithLabel id="search" isFocused onInputChange={handleSearch}
                                        value={searchTerm}><strong>Search:</strong></InputWithLabel>
                        <InputWithLabel id="logMessage" type="url" onInputChange={handleLogMessage} value={logMessage}>
                            <strong>Message:</strong>
                        </InputWithLabel>
                        <Divider/>
                        <List stories={stories.data} onRemoveStory={handleRemoveStory}/>
                    </>
                )
            }
        </div>
    )
}
export default App
