import './App.css'

const list = [
    {
        greeting: 'Hello',
        name: 'Dustin',
        objectId: '27',
        url: 'mailto:dclifford@gmail.com'
    },
    {
        greeting: 'Ciao',
        name: 'Bella',
        objectId: '24',
        url: 'mailto:bella@gmail.com',
    },
    {
        greeting: 'Overtersain',
        name: 'Patty',
        objectId: '23',
        url: 'mailto:hessx111@gmail.com',
    },
];

function Item(prop) {
    return (
        <li key={prop.name}>{prop.greeting}
            <a href={prop.url}>{prop.name}</a>
        </li>
    )
}

function List() {
    return (
        <ul>
            {list.map(item => {
                console.log(<Item key={item.name} name={item.name} greeting={item.greeting} url={item.url} />);
                return (
                    <Item key={item.name} name={item.name} greeting={item.greeting} url={item.url} />
                );
            })
            }
        </ul>
    );
}

function Search() {
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text"/>
        </div>
    );
}

function App() {

    return (
        <div>
            <Search />
            <hr />
            <List/>
        </div>
    )
}

export default App
