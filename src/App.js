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
            user: this.state.user.displayName || this.state.user.email,
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
        //keep user login even when app refreshes
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user
                });
            }
        });
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
                {this.state.user
                    ?
                    <div>
                        <div>
                            <div className='user-profile'>
                                <img src={this.state.user.photoURL} alt='user profile'/>
                            </div>
                        </div>
                        <div className='container'>
                            <section className='add-item'>
                                <form onSubmit={this.handleSubmit}>
                                    <input type="text" name='username' placeholder='Your name?'
                                           value={this.state.user.displayName || this.state.user.email} readOnly={true} />
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
                                                    <p>by: {item.user}
                                                        {item.user === this.state.user.displayName || item.user === this.state.user.email
                                                            ?
                                                            <button onClick={() => this.removeItem(item.id)}>
                                                                <i className="fa fa-trash-o" aria-hidden="true"></i> Remove Item
                                                            </button>
                                                            : null}
                                                    </p>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                    :
                    <div className='wrapper'>
                        <p>You must be logged in to participate in the event and see status :)</p>
                    </div>
                }
            </div>
        )
    }
}

export default App;
