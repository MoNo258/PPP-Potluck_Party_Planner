import React, {Component} from 'react';
import './main.css';
import firebase, {auth, provider} from "./firebase";

class App extends Component {
    constructor() {
        super();
        this.state = {
            currentItem: '',
            username: '',
            items: [],
            user: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        const itemRef = firebase.database().ref('items');
        const item = {
            title: this.state.currentItem,
            user: this.state.username,
        };
        itemRef.push(item);
        this.setState({
            currentItem: '',
            username: ''
        });
    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
    }

    login() {
        auth.signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                this.setState({
                    user
                });
            });
    }

    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null
                });
            });
    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    title: items[item].title,
                    user: items[item].user
                });
            }
            this.setState({
                items: newState
            });
        });
    }


    render() {
        return (
            <div className='app'>
                <header>
                    <div className='wrapper'>
                        <h1>Potluck Party Planner</h1>
                        {this.state.user
                            ?
                            <button onClick={this.logout}>Log Out</button>
                            :
                            <button onClick={this.login}>Log In</button>
                        }
                    </div>
                </header>
                <div className='container'>
                    <section className='add-item'>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name='username' placeholder='Your name?' value={this.state.username}
                                   onChange={this.handleChange}/>
                            <input type="text" name='currentItem' placeholder='What are you bringing?'
                                   value={this.state.currentItem} onChange={this.handleChange}/>
                            <button>Add Item</button>
                        </form>
                    </section>
                    <section className='display-item'>
                        <div className="wrapper">
                            <ul>
                                {this.state.items.map((item) => {
                                    return (
                                        <li key={item.id}>
                                            <h3>{item.title}</h3>
                                            <p>by: {item.user}</p>
                                            <button onClick={() => this.removeItem(item.id)}>
                                                <i className="fa fa-trash-o" aria-hidden="true"></i> Remove Item
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default App;
