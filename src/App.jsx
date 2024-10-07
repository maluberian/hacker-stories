import './App.css'



let clickCount = 0;

const Button = () => {
    return <button onClick={() => clickCount++}>Hello {clickCount}</button>
}

const Item = (prop) => {
    return (
        <li key={prop.object_id}>
            <span><a href={prop.url}>{prop.title}</a></span>
            <span>{`${prop.authors}`}</span>
            <span>{prop.num_comments} comments</span>
            <span>{prop.points} points</span>
        </li>
    )
}

const List = (props) => {
    return (
        <ul>
            {props.list.map(item => {
                console.log(<Item key={item.name} name={item.name} greeting={item.greeting} url={item.url}/>);
                return (
                    <Item
                        key={item.object_id}
                        title={item.title}
                        url={item.url}
                        num_comments={item.num_comments}
                        points={item.points}
                        object_id={item.object_id}
                        authors={item.authors}
                    />
                );
            })
            }
        </ul>
    );
}

const Search = () => {
    const handleChange = (event) => {
        console.log(event)
        console.log(event.target.value)
        console.log(event.nativeEvent)
    }
    const handleBlur = (event) => {
        console.log(event.type, event.target.value, event)
    }
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" onChange={handleChange} onBlur={handleBlur}/>
        </div>
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
    ];
    return (
        <div>
            <Search/>
            <hr/>
            <List list={list}/>
            <Button/>
        </div>
    );
}

export default App
