import React, {Component} from 'react';
import logo from './logo.svg';
import './main.css';

class App extends Component {

    render() {
        return (
            <div className='app'>
                <header>
                    <div className='wrapper'>
                      <h1>Potluck Party Planner</h1>
                    </div>
                </header>
              <div className='container'>
                <section className='add-item'>
                  <form>
                    <input type="text" name='username' placeholder='Your name?'/>
                    <input type="text" name='currentItem' placeholder='WHat are you bringing?'/>
                    <button>Add Item</button>
                  </form>
                </section>
              </div>
            </div>
        )
    }
}

export default App;
